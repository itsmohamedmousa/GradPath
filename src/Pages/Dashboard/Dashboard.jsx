import Loader2 from '../../components/Loader2';
import { useCourse } from '../../contexts/CourseContext';
import { useGpa } from '../../contexts/GpaContext';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
} from 'recharts';
import GpaChart from './GpaChart';

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

  const courseData = courses.map((course) => ({
    name: course.name,
    shortName: course.name
      .split(' ')
      .map((word) => word[0])
      .join(''),
    credits: course.credits,
    status: course.status,
    grade: course.final_grade,
  }));

  function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      const course = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow text-sm border border-gray-200">
          <div>
            <strong>{course.name}</strong>
          </div>
          <div>Grade: {course.grade}</div>
          <div>Credits: {course.credits}</div>
          <div>Status: {course.status}</div>
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GpaChart />
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={courseData}
                margin={{
                  top: 40,
                  right: 50,
                  bottom: 40,
                }}
              >
                <text
                  x="50%"
                  y={20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Course Grades Overview
                </text>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortName" dy={10} />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="grade">
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.grade < 60 ? '#F43F5E' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
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
