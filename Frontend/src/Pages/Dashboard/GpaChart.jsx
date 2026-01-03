import { useGpa } from '../../contexts/GpaContext';
import { PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

function GpaChart() {
  const { data: gpaData } = useGpa();
  const cumulativeGpa = gpaData.gpa?.cumulative_gpa || 0;

  const gpaChartData = [
    { name: 'Failing', value: 2, color: '#ef4444' },
    { name: 'Average', value: 1.6, color: '#f59e0b' },
    { name: 'Excellent', value: 0.4, color: '#10b981' },
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

  const getGpaStatus = (gpa) => {
    if (gpa >= 3.5) return { text: 'Excellent', color: 'text-green-600' };
    if (gpa >= 2.0) return { text: 'Good', color: 'text-amber-600' };
    return { text: 'Needs Improvement', color: 'text-red-600' };
  };

  const status = getGpaStatus(cumulativeGpa);

  return (
    <div className="bg-[rgb(var(--card))] rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-[rgb(var(--text))]">Cumulative GPA</h3>
          <p className={`text-xs font-medium ${status.color}`}>{status.text}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex justify-center items-center">
        <PieChart width={300} height={300}>
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
            className="font-bold text-3xl"
            fill="rgb(var(--text))"
          >
            {cumulativeGpa.toFixed(2)}
          </text>
          {needle(cumulativeGpa, gpaChartData, cx, cy, iR, oR, 'rgb(var(--text))')}
        </PieChart>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
          <span className="text-[rgb(var(--text-secondary))]">0-2.0</span>
        </div>
        <div>
          <div className="w-3 h-3 bg-amber-500 rounded-full mx-auto mb-1"></div>
          <span className="text-[rgb(var(--text-secondary))]">2.0-3.5</span>
        </div>
        <div>
          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
          <span className="text-[rgb(var(--text-secondary))]">3.5-4.0</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-[rgb(var(--border))]">
        <div className="text-center">
          <p className="text-xs text-[rgb(var(--text-secondary))] mb-1">Out of 4.0 Scale</p>
          <p className="text-sm text-[rgb(var(--text))]">
            <span className="font-semibold">{((cumulativeGpa / 4) * 100).toFixed(1)}%</span> of
            maximum
          </p>
        </div>
      </div>
    </div>
  );
}

export default GpaChart;
