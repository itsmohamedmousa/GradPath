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

function Dashboard() {
  const { data: courses, loadingCourses, errorCourses } = useCourse();
  const { data: gpaData, loadingGpa, errorGpa } = useGpa();

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
  {
    /* Calculate GPA */
  }
  const currentGpa = gpaData.gpa.current_gpa;

  const gpaChartData = [
    { name: 'Failing', value: 2, color: '#ff4d4d' },
    { name: 'Average', value: 1.6, color: '#ffd11a' },
    { name: 'Excellent', value: 0.4, color: '#4dff4d' },
  ];

  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;
  const value = 50;
  const RADIAN = Math.PI / 180;
  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle key={'1'} cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path
        key={'2'}
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="#none"
        fill={color}
      />,
    ];
  };

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
          <div className="bg-white p-4 rounded-lg shadow-lg flex justify-center items-center">
            <PieChart width={300} height={300}>
              <text
                x="50%"
                y={24}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                Current GPA
              </text>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={gpaChartData}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                stroke="none"
              >
                {gpaChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <text
                x="50%"
                y={270}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '20px' }}
              >
                GPA: {currentGpa}
              </text>
              {needle(currentGpa, gpaChartData, cx, cy, iR, oR, '#000')}
            </PieChart>
          </div>
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
