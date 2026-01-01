import CoursesTable from './CoursesTable';
import Loader2 from '../../components/Loader/Loader2';
import { useCourse } from '../../contexts/CourseContext';
import AddCourse from './AddCourse';
import EditCourse from './EditCourse';
import { useState } from 'react';
import CurrentGpa from './CurrentGpa';
import { useToastContext } from '../../contexts/ToastContext';
import GradeCalculator from './GradeCalculator';

function Courses() {
  const { data: courses, loadingCourses, errorCourses, refreshCourses } = useCourse();
  const [courseToEdit, setCourseToEdit] = useState({ visible: false, id: null });
  const [currentGpa, setCurrentGpa] = useState(null);
  const { show } = useToastContext();

  function calcCurrentGpa() {
    const gradedCourses = courses.filter(
      (item) => item.final_grade !== null && item.final_grade !== '' && !isNaN(item.final_grade),
    );
    if (gradedCourses.length === 0) {
      setCurrentGpa('0.00');
      return;
    }
    const sumOfCredits = gradedCourses.reduce(
      (acc, item) => acc + parseFloat(item.credits || 0),
      0,
    );
    const totalPoints = gradedCourses.reduce(
      (acc, item) => acc + parseFloat(item.final_grade) * parseFloat(item.credits || 0),
      0,
    );
    if (sumOfCredits === 0) {
      setCurrentGpa('0.00');
      return;
    }
    const gpa = totalPoints / sumOfCredits / 25;
    setCurrentGpa(gpa.toFixed(2));
  }

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
        show('Course updated successfully.', 'success');
        refreshCourses();
        setCourseToEdit((prev) => ({
          ...prev,
          visible: false,
          id: null,
        }));
      } else {
        show(result.message || 'Failed to update course.', 'error');
      }
    } catch (err) {
      show('Something went wrong.', 'error');
    }
  };

  if (loadingCourses) {
    return <Loader2 />;
  }

  if (errorCourses) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h1 className="text-xl font-bold text-red-900 mb-2">Error loading courses</h1>
            <p className="text-red-700">{errorCourses.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Manage your courses and track your academic progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CoursesTable setCourseToEdit={setCourseToEdit} />
            <EditCourse
              editCourse={editCourse}
              courseToEdit={courseToEdit}
              setCourseToEdit={setCourseToEdit}
            />
            <AddCourse />
            <GradeCalculator />
          </div>

          <div>
            {courses.length > 0 && (
              <CurrentGpa calcCurrentGpa={calcCurrentGpa} currentGpa={currentGpa} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
