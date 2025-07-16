import Loader2 from '../../components/Loader/Loader2';
import { useCourse } from '../../contexts/CourseContext';
import { useGpa } from '../../contexts/GpaContext';
import { Link } from 'react-router-dom';
import GpaChart from './GpaChart';
import CoursesChart from './CoursesChart';
import CompletedCreditsChart from './CompletedCreditsChart';
import LastModifiedNote from './LastModifiedNote';

function Dashboard() {
  const { data: courses, loadingCourses, errorCourses } = useCourse();
  const { loadingGpa, errorGpa } = useGpa();

  if (errorCourses || errorGpa) {
    return (
      <div>
        Couldn't fetch data
        <br />
        {errorCourses}
      </div>
    );
  }
  if (loadingCourses || loadingGpa) {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }

  return (
    <div>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CompletedCreditsChart />
          <GpaChart />
          <CoursesChart />
          <LastModifiedNote />
        </div>
      ) : (
        <div className="text-center p-4 my-50">
          <h2 className="text-xl font-semibold">No Courses Available</h2>
          <p className="text-gray-600 mb-2">Please add courses to see your progress.</p>
          <Link
            to="/courses/add"
            className="text-blue-600 p-1 hover:bg-blue-600 hover:text-white border-1 rounded-md transition-all duration-200"
          >
            Add Course
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
