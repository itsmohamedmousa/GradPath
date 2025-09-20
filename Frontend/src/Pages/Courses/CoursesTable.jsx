import { useState } from 'react';
import { useCourse } from '../../contexts/CourseContext';

function CoursesTable({ setEditCourseVisible }) {
  const { data: courses, refreshCourses } = useCourse();
  const [showConfirmModal, setShowConfirmModal] = useState({ courseId: null, show: false });
  const deleteCourse = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses.php?action=delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        refreshCourses();
      } else {
        alert(result.message || 'Failed to delete course.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Something went wrong.');
    }
  };

  const editCourse = async (updatedCourse) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses.php?action=edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedCourse),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        refreshCourses();
      } else {
        alert(result.message || 'Failed to update course.');
      }
      setEditCourseVisible(false);
    } catch (err) {
      console.error('Edit error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <>
      <div className="mt-4 bg-transparent">
        <h1 className="text-xl font-bold mb-3 ml-3">
          Registered Courses
        </h1>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full bg-gray-50 text-black">
            <thead>
              <tr className="bg-gray-200 text-blue-600">
                <th className="px-4 py-2 text-left">Course Name</th>
                <th className="px-4 py-2">Credits</th>
                <th className="px-4 py-2">Grade</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-blue-300 text-gray-600 hover:bg-gray-200 cursor-default"
                >
                  <td className="px-4 py-2">{course.name}</td>
                  <td className="px-4 py-2 text-center">{course.credits || '-'}</td>
                  <td className="px-4 py-2 text-center">{course.final_grade ?? '-'}</td>
                  <td className="px-4 py-2 text-center">{course.status || '-'}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        const newName = prompt('Edit course name:', course.name);
                        const newCredits = prompt('Edit credits:', course.credits);
                        const newGrade = prompt('Edit grade:', course.final_grade);
                        setEditCourseVisible(true);

                        if (newName && newCredits && newGrade) {
                          editCourse({
                            id: course.id,
                            name: newName,
                            credits: parseInt(newCredits),
                            grade: newGrade,
                            status: newGrade == null ? 'Registered' : newGrade >= 60 ? 'Passed' : 'Failed',
                          });
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmModal({ courseId: course.id, show: true })}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showConfirmModal.show && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity duration-300"></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-xl p-6 w-80 text-center
                   transform transition-all duration-300 ease-out
                   opacity-100 translate-y-0"
              style={{
                animation: 'popUp 0.3s ease forwards',
              }}
            >
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete the course?
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
                    setShowConfirmModal({ courseId: null, show: true });
                    deleteCourse(showConfirmModal.courseId);
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
    </>
  );
}

export default CoursesTable;
