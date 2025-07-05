import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateBMI, getBMICategory } from '../services/api';
import { Calculator } from 'lucide-react';
import './NoSpinner.css';

const bmiSegments = [
  { label: 'Underweight', min: 0, max: 18.5, color: 'bg-blue-400' },
  { label: 'Normal', min: 18.5, max: 25, color: 'bg-green-500' },
  { label: 'Overweight', min: 25, max: 30, color: 'bg-yellow-400' },
  { label: 'Obese-1', min: 30, max: 35, color: 'bg-orange-400' },
  { label: 'Obese-2', min: 35, max: 40, color: 'bg-red-400' },
  { label: 'Obese-3', min: 40, max: 60, color: 'bg-red-700' },
];

const bmiPieSegments = [
  { label: 'Underweight', min: 0, max: 18.5, color: '#60a5fa' },
  { label: 'Normal', min: 18.5, max: 25, color: '#22c55e' },
  { label: 'Overweight', min: 25, max: 30, color: '#facc15' },
  { label: 'Obese-1', min: 30, max: 35, color: '#fb923c' },
  { label: 'Obese-2', min: 35, max: 40, color: '#f87171' },
  { label: 'Obese-3', min: 40, max: 60, color: '#b91c1c' },
];

const BMI_MIN = 0;
const BMI_MAX = 60;
const TICKS = [0, 18.5, 25, 30, 35, 40];

// Custom visual widths for each segment (must sum to 100)
const bmiVisualWidths = [15, 25, 20, 15, 12.5, 12.5];

function getBMIMarkerPosition(bmi, barWidth) {
  if (!bmi || !barWidth) return 0;
  let pos = 0;
  let total = 0;
  for (let i = 0; i < bmiSegments.length; i++) {
    const seg = bmiSegments[i];
    const segWidth = ((seg.max - seg.min) / (60 - 0)) * barWidth;
    if (bmi >= seg.min && bmi <= seg.max) {
      pos = total + ((bmi - seg.min) / (seg.max - seg.min)) * segWidth;
      break;
    }
    total += segWidth;
  }
  return Math.min(Math.max(pos, 0), barWidth);
}

function getBMIAngle(bmi) {
  // Map BMI to angle in radians (0 = left, PI = right)
  if (!bmi) return 0;
  const ratio = Math.min(Math.max((bmi - BMI_MIN) / (BMI_MAX - BMI_MIN), 0), 1);
  return Math.PI * ratio;
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  // SVG arc path for a segment
  const start = {
    x: cx + r * Math.cos(startAngle),
    y: cy + r * Math.sin(startAngle),
  };
  const end = {
    x: cx + r * Math.cos(endAngle),
    y: cy + r * Math.sin(endAngle),
  };
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 1, end.x, end.y
  ].join(' ');
}

function BMIPieChart({ userBMI, targetBMI }) {
  const cx = 120, cy = 120, r = 100;
  let start = Math.PI;
  const arcs = bmiPieSegments.map((seg, idx) => {
    const segStart = start;
    const segEnd = Math.PI + (Math.PI * (seg.max - BMI_MIN) / (BMI_MAX - BMI_MIN));
    const arc = describeArc(cx, cy, r, segStart, segEnd);
    start = segEnd;
    return (
      <path key={idx} d={arc} stroke={seg.color} strokeWidth={20} fill="none" />
    );
  });
  // Markers
  const userAngle = Math.PI + getBMIAngle(userBMI);
  const targetAngle = Math.PI + getBMIAngle(targetBMI);
  const marker = (angle, color, label) => (
    <g>
      <line x1={cx + (r - 10) * Math.cos(angle)} y1={cy + (r - 10) * Math.sin(angle)}
            x2={cx + (r + 10) * Math.cos(angle)} y2={cy + (r + 10) * Math.sin(angle)}
            stroke={color} strokeWidth={4} />
      <text x={cx + (r + 24) * Math.cos(angle)} y={cy + (r + 24) * Math.sin(angle)}
            fontSize="12" fontWeight="bold" fill={color} textAnchor="middle" alignmentBaseline="middle">{label}</text>
    </g>
  );
  // Ticks
  const ticks = TICKS.map((tick, idx) => {
    const angle = Math.PI + getBMIAngle(tick);
    return (
      <g key={idx}>
        <line x1={cx + (r + 12) * Math.cos(angle)} y1={cy + (r + 12) * Math.sin(angle)}
              x2={cx + (r + 18) * Math.cos(angle)} y2={cy + (r + 18) * Math.sin(angle)}
              stroke="#888" strokeWidth={2} />
        <text x={cx + (r + 30) * Math.cos(angle)} y={cy + (r + 30) * Math.sin(angle)}
              fontSize="11" fill="#888" textAnchor="middle" alignmentBaseline="middle">{tick}{idx === TICKS.length - 1 ? '+' : ''}</text>
      </g>
    );
  });
  return (
    <svg width={240} height={140} viewBox="0 0 240 140">
      {/* Segments */}
      {arcs}
      {/* Markers */}
      {userBMI && marker(userAngle, '#ef4444', 'You')}
      {targetBMI && marker(targetAngle, '#22c55e', 'Target')}
      {/* Ticks */}
      {ticks}
    </svg>
  );
}

// Helper to get marker position as a percentage using custom visual widths
function getVisualPos(bmi) {
  if (!bmi) return 0;
  let acc = 0;
  for (let i = 0; i < bmiPieSegments.length; i++) {
    const seg = bmiPieSegments[i];
    const segWidth = bmiVisualWidths[i];
    if (bmi >= seg.max) {
      acc += segWidth;
    } else if (bmi > seg.min) {
      const segRatio = (bmi - seg.min) / (seg.max - seg.min);
      acc += segRatio * segWidth;
      break;
    } else {
      break;
    }
  }
  return acc;
}

function BMISegmentBar({ userBMI, targetBMI }) {
  const barRef = React.useRef(null);
  const youLabelRef = React.useRef(null);
  const targetLabelRef = React.useRef(null);
  const [barWidth, setBarWidth] = React.useState(0);
  const [labelWidths, setLabelWidths] = React.useState({ you: 0, target: 0 });
  React.useEffect(() => {
    if (barRef.current) setBarWidth(barRef.current.offsetWidth);
    const handleResize = () => {
      if (barRef.current) setBarWidth(barRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  React.useEffect(() => {
    setLabelWidths({
      you: youLabelRef.current ? youLabelRef.current.offsetWidth : 0,
      target: targetLabelRef.current ? targetLabelRef.current.offsetWidth : 0,
    });
  }, [userBMI, targetBMI, barWidth]);
  function getPos(bmi) {
    if (!bmi || !barWidth) return 0;
    const ratio = Math.min(Math.max((bmi - BMI_MIN) / (BMI_MAX - BMI_MIN), 0), 1);
    return ratio * barWidth;
  }
  // Use getVisualPos for marker positions
  const youPosPercent = userBMI ? getVisualPos(userBMI) : null;
  const targetPosPercent = targetBMI ? getVisualPos(targetBMI) : null;
  // Offset logic for label overlap
  let youLabelStyle = { transform: 'translateX(-50%)' };
  let targetLabelStyle = { transform: 'translateX(-50%)' };
  if (
    youPosPercent !== null && targetPosPercent !== null &&
    Math.abs(youPosPercent - targetPosPercent) < (labelWidths.you / 2 + labelWidths.target / 2 + 8)
  ) {
    // If overlap, nudge left/right
    if (youPosPercent < targetPosPercent) {
      youLabelStyle = { transform: `translateX(-70%)` };
      targetLabelStyle = { transform: `translateX(-30%)` };
    } else {
      youLabelStyle = { transform: `translateX(-30%)` };
      targetLabelStyle = { transform: `translateX(-70%)` };
    }
  }
  return (
    <div className="w-full flex flex-col items-center">
      {/* Segments and Legend in one flex row for perfect alignment */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="relative w-full h-10 flex items-center mb-1">
          {/* Segments */}
          <div className="w-full h-5 flex rounded-full overflow-hidden shadow-inner">
            {bmiPieSegments.map((seg, idx) => (
              <div key={idx}
                className="h-full"
                style={{
                  width: `${bmiVisualWidths[idx]}%`,
                  background: seg.color,
                }}
              />
            ))}
          </div>
          {/* You Marker */}
          {youPosPercent !== null && (
            <div
              className="absolute flex flex-col items-center"
              style={{ left: `calc(${youPosPercent}% - 0.5px)` }}
            >
              <div className="w-1 h-9 bg-red-600 rounded-full shadow-lg" />
              <span
                ref={youLabelRef}
                className="text-[11px] text-red-700 font-bold mt-1 whitespace-nowrap"
                style={youLabelStyle}
              >You</span>
            </div>
          )}
          {/* Target Marker */}
          {targetPosPercent !== null && (
            <div
              className="absolute flex flex-col items-center"
              style={{ left: `calc(${targetPosPercent}% - 0.5px)` }}
            >
              <div className="w-1 h-9 bg-green-600 rounded-full shadow-lg" />
              <span
                ref={targetLabelRef}
                className="text-[11px] text-green-700 font-bold mt-1 whitespace-nowrap"
                style={targetLabelStyle}
              >Target</span>
            </div>
          )}
        </div>
        {/* Legend - perfectly aligned with segments above */}
        <div className="w-full flex" style={{ marginTop: 2 }}>
          {bmiPieSegments.map((seg, idx) => (
            <span
              key={idx}
              className="text-center text-[12px] font-semibold text-gray-500"
              style={{
                color: seg.color,
                width: `${bmiVisualWidths[idx]}%`,
                minWidth: 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >{seg.label}</span>
          ))}
        </div>
      </div>
      {/* Ticks */}
      <div className="flex justify-between w-full max-w-2xl text-[10px] text-gray-400 mt-1">
        {TICKS.map((tick, idx) => (
          <span key={idx} className="text-center flex-1">{tick}{idx === TICKS.length - 1 ? '+' : ''}</span>
        ))}
      </div>
    </div>
  );
}

// Helper to get legend color for a given BMI
function getBMISegmentColor(bmi) {
  if (!bmi) return '#000';
  for (let i = 0; i < bmiPieSegments.length; i++) {
    if (bmi < bmiPieSegments[i].max) return bmiPieSegments[i].color;
  }
  return bmiPieSegments[bmiPieSegments.length - 1].color;
}

const BMICalculator = () => {
  const [form, setForm] = useState({ age: '', height: '', weight: '', desiredBMI: '' });
  const [result, setResult] = useState(null);
  const barRef = useRef(null);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (barRef.current) {
      setBarWidth(barRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (barRef.current) setBarWidth(barRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const desiredBMI = parseFloat(form.desiredBMI);
    if (!height || !weight) return;
    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    let requiredWeight = null;
    let weightDiff = null;
    if (desiredBMI && height) {
      requiredWeight = (desiredBMI * (height / 100) * (height / 100));
      weightDiff = (weight - requiredWeight);
    }
    setResult({ bmi, category, requiredWeight, weightDiff });
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-blue-100 via-white to-cyan-100 py-10 px-2">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 mt-2 w-full">
          <div className="relative flex flex-col items-center">
            <div className="z-10 rounded-full bg-white/80 shadow-lg p-3 mb-2">
              <Calculator className="w-14 h-14 text-blue-500 drop-shadow-lg" />
            </div>
            <h1 className="text-3xl font-extrabold text-center tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-2">BMI Calculator</h1>
          </div>
          <p className="text-sm text-gray-600 text-center max-w-2xl mt-2">Calculate your Body Mass Index and see how much weight you need to lose or gain to reach your goal.</p>
        </div>
        {/* Cards Section */}
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 w-full max-w-3xl mx-auto transition-all duration-200 hover:shadow-2xl focus-within:shadow-2xl border border-blue-100">
            {/* Input Section */}
            <form onSubmit={handleCalculate} className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    onWheel={e => e.target.blur()}
                    required
                    className="no-spinner w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    onWheel={e => e.target.blur()}
                    required
                    className="no-spinner w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    onWheel={e => e.target.blur()}
                    required
                    className="no-spinner w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Desired BMI</label>
                  <input
                    type="number"
                    id="desiredBMI"
                    name="desiredBMI"
                    value={form.desiredBMI}
                    onChange={handleChange}
                    onWheel={e => e.target.blur()}
                    placeholder="e.g., 22.5 (optional)"
                    className="no-spinner w-full"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition mb-2 mt-2"
              >
                Calculate BMI
              </button>
            </form>
            {/* Result Card */}
            <div className="flex-1 bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col justify-center min-h-[260px] border border-blue-100 mt-4 md:mt-0 transition-all duration-200">
              {result && (
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold mb-2">Your BMI is:</div>
                  <div className="text-5xl md:text-6xl font-extrabold text-blue-500 mb-2">{Number(result.bmi).toFixed(2)}</div>
                  <div className="text-lg font-semibold mb-2">
                    BMI Category: <span
                      style={{ color: (typeof result.category === 'object' && result.category.color) ? result.category.color : undefined }}
                    >
                      {typeof result.category === 'object' ? result.category.category : (result.category || '-')}
                    </span>
                  </div>
                  {form.desiredBMI && (
                    <>
                      <div className="mt-4 text-base">To reach a BMI of :</div>
                      <div className="text-xl font-bold text-blue-700 mb-1">Target Weight: {Number(result.requiredWeight).toFixed(2)} kg</div>
                      <div className={
                        result.weightDiff > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'
                      }>
                        {result.weightDiff > 0
                          ? `You need to lose ${Math.abs(Number(result.weightDiff)).toFixed(2)} kg`
                          : result.weightDiff < 0
                            ? `You need to gain ${Math.abs(Number(result.weightDiff)).toFixed(2)} kg`
                            : 'You are at your target weight!'}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* BMI Segment Bar Section */}
          <div className="w-full flex flex-col items-center mt-6 mb-6">
            <BMISegmentBar userBMI={result?.bmi} targetBMI={form.desiredBMI ? Number(form.desiredBMI) : null} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator; 