import CoursesTable from './CoursesTable';
import Loader2 from '../../components/Loader/Loader2';
import { useCourse } from '../../contexts/CourseContext';
import AddCourse from './AddCourse';
import EditCourse from './EditCourse';
import { useState } from 'react';

function Courses() {
  const { loadingCourses, errorCourses, refreshCourses } = useCourse();
  const [courseToEdit, setCourseToEdit] = useState({ visible: false, id: null });

  const editCourse = async (updatedCourse) => {
    console.log('Course to edit:', courseToEdit);
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
        setCourseToEdit((prev) => ({
          ...prev,
          visible: false,
          id: null,
        }));
        alert('Course updated successfully.');
      } else {
        alert(result.message || 'Failed to update course.');
      }
    } catch (err) {
      console.error('Edit error:', err);
      alert('Something went wrong.');
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
      <CoursesTable editCourse={editCourse} setCourseToEdit={setCourseToEdit} />
      <EditCourse
        editCourse={editCourse}
        courseToEdit={courseToEdit}
        setCourseToEdit={setCourseToEdit}
      />
      <AddCourse />
    </>
  );
}

export default Courses;
