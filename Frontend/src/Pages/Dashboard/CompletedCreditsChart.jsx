import { useGpa } from '../../contexts/GpaContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useCourse } from '../../contexts/CourseContext';
import { Cell, Pie, PieChart, Legend, Tooltip } from 'recharts';

function CompletedCreditsChart() {
  const { data: gpaData } = useGpa();
  const { data: profileData } = useProfile();
  const { data: coursesData } = useCourse();

  const completedCredits = gpaData.gpa?.completed_credits;
  const registeredCredits = coursesData?.reduce((cr, course) => {
    return course.status.toLowerCase() === 'registered' ? cr + course.credits : cr;
  }, 0);
  const totalCredits = profileData.profile?.total_credits;
  const remainingCredits = totalCredits - completedCredits - registeredCredits;
  const chartData = [
    { name: 'Completed Credits', value: completedCredits, color: '#4dff4d' },
    { name: 'Remaining Credits', value: remainingCredits, color: '#ff4d4d' },
    { name: 'Registered Credits', value: registeredCredits, color: '#ffd11a' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex justify-center items-center">
      <PieChart width={300} height={300}>
        <text
          x="50%"
          y={24}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '16px', fontWeight: 'bold' }}
        >
          Credits Distribution
        </text>
        <Pie
          data={chartData}
          cx="13%"
          cy="50%"
          outerRadius={80}
          innerRadius={60}
          paddingAngle={3}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, value, percent }) =>
            name == 'Registered Credits' && value == 0 ? null : `${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} credits`, `${name}`]}
          itemStyle={{ color: '#f1f5f9' }}
          labelStyle={{ color: '#f1f5f9', fontSize: '14px' }}   
          wrapperStyle={{ fontSize: '14px', color: '#f1f5f9' }}
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            borderRadius: '4px',
            border: 'none',
            padding: '8px 12px',
          }}
        />
        <Legend
          layout="vertical"
          verticalAlign="bottom"
          align="left"
          iconSize={10}
          wrapperStyle={{ fontSize: 12, paddingLeft: 20 }}
          formatter={(value) => {
            return value.length > 15 ? `${value.substring(0, 12)}...` : value;
          }}
        />
        <text
          x="80%"
          y="95%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '13px' }}
        >
          Total Credits: {totalCredits}
        </text>
      </PieChart>
    </div>
  );
}

export default CompletedCreditsChart;
