import CoursesTable from './CoursesTable';
import Loader2 from '../../components/Loader/Loader2';
import { useCourse } from '../../contexts/CourseContext';
import AddCourse from './AddCourse';
import EditCourse from './EditCourse';
import { useState } from 'react';
import CurrentGpa from './CurrentGpa';
import { useToastContext } from '../../contexts/ToastContext';

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
        show('Courese updated successfully.', 'success');
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
      show('Something went wront.', 'error');
    }
  };

  if (loadingCourses) {
    return <Loader2 />;
  }

  if (errorCourses) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="text-2xl font-bold">Error loading courses</h1>
        <p>{errorCourses.message}</p>
      </div>
    );
  }

  return (
    <>
      <CoursesTable setCourseToEdit={setCourseToEdit} />
      <EditCourse
        editCourse={editCourse}
        courseToEdit={courseToEdit}
        setCourseToEdit={setCourseToEdit}
      />
      {courses.length > 0 ? (
        <CurrentGpa calcCurrentGpa={calcCurrentGpa} currentGpa={currentGpa} />
      ) : (
        <div></div>
      )}
      <AddCourse />
    </>
  );
}

export default Courses;
