import Loader2 from '../../components/Loader2';
import { useCourse } from '../../contexts/CourseContext';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function Dashboard() {
  const { data: courses, loadingCourses, errorCourses } = useCourse();
  if (errorCourses) {
    return (
      <div>
        Couldn't fetch data
        <br />
        {errorCourses}
      </div>
    );
  }
  if (loadingCourses) {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }
  const courseData = courses.map((course) => ({
    name: course.name,
    credits: course.credits,
    status: course.status,
    grade: course.final_grade,
  }));
  return (
    <div>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={courseData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="grade">
                {courseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.grade < 60 ? '#F43F5E' : '#3B82F6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold">No Courses Available</h2>
          <p className="text-gray-600">You have not added any courses yet.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
