import CoursesTable from './CoursesTable';
import Loader2 from '../../components/Loader/Loader2';
import { useCourse } from '../../contexts/CourseContext';
import AddCourse from './AddCourse';

function Courses() {
  const { loadingCourses, errorCourses } = useCourse();

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
      <CoursesTable />
      <AddCourse />
    </>
  );
}

export default Courses;
