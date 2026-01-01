import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { useSemester } from '../../contexts/SemesterContext';
import { TrendingUp, RefreshCw } from 'lucide-react';

function CurrentGpa({ calcCurrentGpa, currentGpa }) {
  const { currentSemester } = useSemester();
  const [semesterName, setSemesterName] = useState('');

  useEffect(() => {
    calcCurrentGpa();
    if (currentSemester && currentSemester.name) {
      setSemesterName(currentSemester.name);
    }
  }, []);

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

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Current GPA</h3>
            {semesterName && <p className="text-xs text-gray-500">{semesterName}</p>}
          </div>
        </div>
      </div>

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
            className="font-bold text-2xl"
            fill="#111827"
          >
            {currentGpa || '0.00'}
          </text>
          {needle(currentGpa, gpaChartData, cx, cy, iR, oR, '#1f2937')}
        </PieChart>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
          <span className="text-gray-600">0-2.0</span>
        </div>
        <div>
          <div className="w-3 h-3 bg-amber-500 rounded-full mx-auto mb-1"></div>
          <span className="text-gray-600">2.0-3.5</span>
        </div>
        <div>
          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
          <span className="text-gray-600">3.5-4.0</span>
        </div>
      </div>
    </div>
  );
}

export default CurrentGpa;
