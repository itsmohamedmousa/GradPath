import Loader2 from '../../components/Loader/Loader2';
import { useCourse } from '../../contexts/CourseContext';
import { useGpa } from '../../contexts/GpaContext';
import { useNotes } from '../../contexts/NotesContext';
import { Link } from 'react-router-dom';
import GpaChart from './GpaChart';
import CoursesChart from './CoursesChart';
import CompletedCreditsChart from './CompletedCreditsChart';
import LastModifiedNote from './LastModifiedNote';
import UpcomingEvent from './UpcomingEvent';
import { useEvent } from '../../contexts/EventContext';
import { AlertCircle, Plus, BarChart3 } from 'lucide-react';

function Dashboard() {
  const { data: courses, loadingCourses, errorCourses } = useCourse();
  const { loadingGpa, errorGpa } = useGpa();
  const { loadingNotes, errorNotes } = useNotes();
  const { loadingEvent, errorEvent } = useEvent();

  if (errorCourses || errorGpa || errorNotes || errorEvent) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h1 className="text-xl font-bold text-red-900 mb-2">Couldn't fetch data</h1>
                <div className="space-y-1 text-sm text-red-700">
                  {errorCourses && <p>• Courses: {errorCourses.message}</p>}
                  {errorGpa && <p>• GPA: {errorGpa.message}</p>}
                  {errorNotes && <p>• Notes: {errorNotes.message}</p>}
                  {errorEvent && <p>• Events: {errorEvent.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadingCourses || loadingGpa || loadingNotes || loadingEvent) {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your academic progress and activities</p>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CompletedCreditsChart />
            <GpaChart />
            <CoursesChart />
            <LastModifiedNote />
            <UpcomingEvent />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Available</h2>
              <p className="text-gray-600 mb-6">
                Start tracking your academic progress by adding your first course.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Your First Course
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
