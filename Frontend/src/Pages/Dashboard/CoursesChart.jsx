import { useCourse } from '../../contexts/CourseContext';
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
import { BarChart3 } from 'lucide-react';

function CoursesChart() {
  const { data: courses } = useCourse();

  const courseData = courses
    .filter((course) => course.final_grade !== null && course.final_grade !== undefined)
    .map((course) => ({
      name: course.name,
      shortName: course.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 4),
      credits: course.credits,
      status: course.status,
      grade: course.final_grade,
    }));

  const getBarColor = (grade) => {
    if (grade >= 90) return '#10b981'; // green
    if (grade >= 80) return '#3b82f6'; // blue
    if (grade >= 70) return '#f59e0b'; // amber
    if (grade >= 60) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      const course = payload[0].payload;
      return (
        <div className="bg-[rgb(var(--card))] bg-opacity-95 p-3 rounded-lg shadow-xl border border-[rgb(var(--border))]">
          <div className="text-[rgb(var(--text))]">
            <p className="font-bold mb-2">{course.name}</p>
            <div className="space-y-1 text-sm">
              <p>
                Grade: <span className="font-semibold">{course.grade}%</span>
              </p>
              <p>
                Credits: <span className="font-semibold">{course.credits}</span>
              </p>
              <p>
                Status: <span className="font-semibold">{course.status}</span>
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const averageGrade =
    courseData.length > 0
      ? (courseData.reduce((sum, course) => sum + course.grade, 0) / courseData.length).toFixed(1)
      : 0;

  return (
    <div className="bg-[rgb(var(--card))] rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-[rgb(var(--text))]">Course Grades</h3>
            <p className="text-xs text-[rgb(var(--text-secondary))]">Performance Overview</p>
          </div>
        </div>
        {courseData.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-[rgb(var(--text-secondary))]">Average</p>
            <p className="text-lg font-bold text-indigo-600">{averageGrade}%</p>
          </div>
        )}
      </div>

      {/* Chart */}
      {courseData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={courseData}
            margin={{
              top: 20,
              right: 10,
              left: -20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              label={{
                value: 'Grade (%)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#6b7280' },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
            <Bar dataKey="grade" radius={[8, 8, 0, 0]}>
              {courseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.grade)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center text-[rgb(var(--text-secondary))]">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 text-[rgb(var(--text-secondary))]" />
            <p className="text-sm">No graded courses yet</p>
          </div>
        </div>
      )}

      {/* Legend */}
      {courseData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-5 gap-2 text-xs text-center">
            <div>
              <div className="w-3 h-3 bg-green-500 rounded mx-auto mb-1"></div>
              <span className="text-[rgb(var(--text-secondary))]">90-100</span>
            </div>
            <div>
              <div className="w-3 h-3 bg-blue-500 rounded mx-auto mb-1"></div>
              <span className="text-[rgb(var(--text-secondary))]">80-89</span>
            </div>
            <div>
              <div className="w-3 h-3 bg-amber-500 rounded mx-auto mb-1"></div>
              <span className="text-[rgb(var(--text-secondary))]">70-79</span>
            </div>
            <div>
              <div className="w-3 h-3 bg-orange-500 rounded mx-auto mb-1"></div>
              <span className="text-[rgb(var(--text-secondary))]">60-69</span>
            </div>
            <div>
              <div className="w-3 h-3 bg-red-500 rounded mx-auto mb-1"></div>
              <span className="text-[rgb(var(--text-secondary))]">&lt;60</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoursesChart;
