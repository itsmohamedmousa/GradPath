import { useEffect, useRef, useState } from 'react';
import { Mail, GraduationCap, Building2, Award, Edit2, Camera } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import GpaChart from '../Dashboard/GpaChart';
import { useProfile } from '../../contexts/ProfileContext';
import { useGpa } from '../../contexts/GpaContext';
import Loader2 from '../../components/Loader/Loader2';
import { useCourse } from '../../contexts/CourseContext';

export default function UserProfile() {
  const { data: profileData, loadingProfile, errorProfile, refreshProfile } = useProfile();
  const { loadingGpa, errorGpa, refreshGpa } = useGpa();
  const { refreshCourses } = useCourse();
  const { show } = useToastContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [university, setUniversity] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);
  const [profilePic, setProfilePic] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=John');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);
  const [editForm, setEditForm] = useState({
    username: username,
    email: email,
    major: major,
    university: university,
    totalCredits: totalCredits,
    profilePic: profilePic,
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setEditForm((prev) => ({
        ...prev,
        profilePic: data.imageUrl,
      }));
    } catch (err) {
      console.error(err);
      show(err.message || 'Image upload failed', 'error');
    }
  };

  useEffect(() => {
    if (profileData && profileData.profile) {
      const user = profileData.profile;
      setUsername(user.username || '');
      setEmail(user.email || '');
      setMajor(user.major || '');
      setUniversity(user.university || '');
      setTotalCredits(user.total_credits || 0);
      setProfilePic(user.profile_pic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=John');
    }
  }, [profileData]);

  const confirmEndSemester = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/semester.php`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        show(data.message, 'error');
        return;
      }

      show(
        `Semester ended! GPA: ${data.current_semester_gpa}, Cumulative: ${data.cumulative_gpa}`,
        'success',
      );

      refreshProfile(); 
      refreshGpa();
      refreshCourses();
    } catch (err) {
      show('Failed to end semester', 'error');
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      username,
      email,
      major,
      university,
      totalCredits,
      profilePic,
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: editForm.username,
          email: editForm.email,
          major: editForm.major,
          university: editForm.university,
          total_credits: editForm.totalCredits,
          profile_pic: editForm.profilePic,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setProfilePic(editForm.profilePic);
        refreshProfile();
        setShowEditModal(false);
        show('Profile updated successfully!', 'success');
      } else {
        show(result.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      show(err.message || 'Error updating profile', 'error');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  if (errorGpa || errorProfile) {
    return (
      <div>
        Couldn't fetch data
        <br />
        {errorGpa ? `GPA: ${errorGpa.message}` : ''}
        {errorProfile ? `Profile: ${errorProfile.message}` : ''}
      </div>
    );
  }

  if (loadingGpa || loadingProfile) {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{username}</h2>
            <div className="space-y-1 text-gray-600">
              <p className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="w-4 h-4" />
                {email}
              </p>
              <p className="flex items-center gap-2 justify-center sm:justify-start">
                <GraduationCap className="w-4 h-4" />
                {major}
              </p>
              <p className="flex items-center gap-2 justify-center sm:justify-start">
                <Building2 className="w-4 h-4" />
                {university}
              </p>
              <p className="flex items-center gap-2 justify-center sm:justify-start">
                <Award className="w-4 h-4" />
                {totalCredits} Credits
              </p>
            </div>
          </div>
          <button
            onClick={handleEditProfile}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
        <GpaChart />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
          <div className="space-y-4">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              End Semester
            </button>
            <p className="text-sm text-gray-600">
              Click this button to finalize your semester grades and update your cumulative GPA.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-red-600 font-medium rounded-lg transition-colors duration-200"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity duration-300"></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 sm:px-4">
            <div
              className="
                bg-white rounded-xl shadow-xl w-full
                max-w-sm sm:max-w-md
                max-h-[90vh] overflow-y-auto
                p-4 sm:p-6
                transform transition-all duration-300 ease-out
              "
              style={{ animation: 'popUp 0.3s ease forwards' }}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Edit Profile</h2>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={editForm.profilePic}
                    alt="Profile"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-100 object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Major */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                    <input
                      type="text"
                      value={editForm.major}
                      onChange={(e) => handleInputChange('major', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* University */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      University
                    </label>
                    <input
                      type="text"
                      value={editForm.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Total Credits (Full width) */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Credits
                    </label>
                    <input
                      type="number"
                      value={editForm.totalCredits}
                      onChange={(e) =>
                        handleInputChange('totalCredits', parseInt(e.target.value) || NaN)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes popUp {
              0% {
                opacity: 0;
                transform: translateY(50px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity duration-300"></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-xl p-6 w-80 text-center
             transform transition-all duration-300 ease-out
             opacity-100 translate-y-0"
              style={{ animation: 'popUp 0.3s ease forwards' }}
            >
              <h2 className="text-lg font-semibold mb-4">Delete Account</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile.php`, {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                      });
                      const result = await response.json();

                      if (result.success) {
                        localStorage.removeItem('token');
                        show('Account deleted successfully', 'success');
                        window.location.href = '/login'; // redirect to login
                      } else {
                        show(result.message || 'Failed to delete account', 'error');
                      }
                    } catch (err) {
                      console.error('Error deleting account:', err);
                      show(err.message || 'Error deleting account', 'error');
                    }
                  }}
                  className="flex-1 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* End Semester Confirmation Modal */}
      {showConfirmModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity duration-300"></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-xl p-6 w-80 text-center
                   transform transition-all duration-300 ease-out
                   opacity-100 translate-y-0"
              style={{
                animation: 'popUp 0.3s ease forwards',
              }}
            >
              <h2 className="text-lg font-semibold mb-4">End Semester</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to end this semester? This will calculate your current
                semester GPA and update your cumulative GPA.
              </p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                  }}
                  className="flex-1 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    confirmEndSemester();
                  }}
                  className="flex-1 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes popUp {
              0% {
                opacity: 0;
                transform: translateY(50px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
