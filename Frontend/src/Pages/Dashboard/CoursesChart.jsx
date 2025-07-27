import { useCourse } from "../../contexts/CourseContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function CoursesChart() {
  const { data: courses } = useCourse();
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
              <Cell key={`cell-${index}`} fill={entry.grade < 60 ? '#F43F5E' : entry.grade < 100 ? '#3B82F6' : '#3dd13dff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CoursesChart;
