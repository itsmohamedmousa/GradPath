import { useEffect, useState } from 'react';
import { useCourse } from '../../contexts/CourseContext';
import { useToastContext } from '../../contexts/ToastContext';
import { useSemester } from '../../contexts/SemesterContext';
import { BookOpen } from 'lucide-react';

function CoursesTable({ setCourseToEdit }) {
  const { data: courses, refreshCourses } = useCourse();
  const { currentSemester } = useSemester();
  const [semesterName, setSemesterName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState({ courseId: null, visible: false });
  const { show } = useToastContext();

  useEffect(() => {
    if (currentSemester && currentSemester.name) {
      setSemesterName(currentSemester.name);
    }
  }, [currentSemester]);

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
        show('Course deleted successfully.', 'success');
        refreshCourses();
        setShowConfirmModal({ courseId: null, visible: false });
      } else {
        show(result.message || 'Failed to delete course.', 'error');
      }
    } catch (err) {
      show('Something went wrong.', 'error');
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Registered Courses
            {semesterName && (
              <span className="text-gray-500 font-normal ml-2">— {semesterName}</span>
            )}
          </h2>
          <span className="text-sm text-gray-600">
            {courses.length} {courses.length === 1 ? 'course' : 'courses'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Course Name
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Credits
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Grade</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-4 text-gray-900">{course.name}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{course.credits || '-'}</td>
                  <td className="px-4 py-4 text-center">
                    {course.final_grade !== null && course.final_grade !== undefined ? (
                      <span
                        className={`font-semibold ${
                          course.final_grade >= 90
                            ? 'text-green-600'
                            : course.final_grade >= 80
                            ? 'text-blue-600'
                            : course.final_grade >= 70
                            ? 'text-yellow-600'
                            : course.final_grade >= 60
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                      >
                        {course.final_grade}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === 'Passed'
                          ? 'bg-green-100 text-green-700'
                          : course.status === 'Failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {course.status || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setCourseToEdit((prev) => ({
                            ...prev,
                            visible: true,
                            id: course.id,
                          }));
                        }}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowConfirmModal({ courseId: course.id, visible: true })}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No courses found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmModal.visible && (
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
                Are you sure you want to delete this course? This action cannot be undone.
              </p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => setShowConfirmModal({ courseId: null, visible: false })}
                  className="flex-1 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal({ courseId: null, visible: false });
                    handleDelete();
                  }}
                  className="flex-1 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
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
