import { useGpa } from '../../contexts/GpaContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useCourse } from '../../contexts/CourseContext';
import { Cell, Pie, PieChart, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';

function CompletedCreditsChart() {
  const { data: gpaData } = useGpa();
  const { data: profileData } = useProfile();
  const { data: coursesData } = useCourse();

  const completedCredits = gpaData.gpa?.completed_credits || 0;
  const registeredCredits =
    coursesData?.reduce((cr, course) => {
      return course.status.toLowerCase() === 'registered' ? cr + course.credits : cr;
    }, 0) || 0;
  const totalCredits = profileData.profile?.total_credits || 0;
  const remainingCredits = totalCredits - completedCredits - registeredCredits;

  const chartData = [
    { name: 'Completed Credits', value: completedCredits, color: '#10b981' },
    { name: 'Registered Credits', value: registeredCredits, color: '#f59e0b' },
    {
      name: 'Remaining Credits',
      value: remainingCredits > 0 ? remainingCredits : 0,
      color: '#ef4444',
    },
  ].filter((item) => item.value > 0);

  const completionPercentage =
    totalCredits > 0 ? ((completedCredits / totalCredits) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Award className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Credits Distribution</h3>
          <p className="text-xs text-gray-600">{completionPercentage}% Complete</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex justify-center items-center">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={55}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} credits`, name]}
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                borderRadius: '8px',
                border: 'none',
                padding: '8px 12px',
                color: '#fff',
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Total Credits */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total Credits</span>
          <span className="text-lg font-bold text-gray-900">{totalCredits}</span>
        </div>
      </div>
    </div>
  );
}

export default CompletedCreditsChart;
