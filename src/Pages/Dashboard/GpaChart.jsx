import { useGpa } from '../../contexts/GpaContext';
import { PieChart, Pie, Cell } from 'recharts';

function GpaChart() {
  const { data: gpaData } = useGpa();
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
  );
}

export default GpaChart;
