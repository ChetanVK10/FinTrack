import React from 'react';
import { useApp } from '../context/AppContext';
import type { TimeRange } from '../types';

const TimeRangeSelector: React.FC = () => {
  const { timeRange, setTimeRange, isDarkMode } = useApp();
  
  const ranges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' },
  ];
  
  return (
    <div className={`inline-flex p-1 rounded-xl border transition-all duration-500
      ${isDarkMode 
        ? 'bg-[#1a1f2e] border-white/5' 
        : 'bg-gray-100 border-gray-200'}`}>
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => setTimeRange(range.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${timeRange === range.value
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30'
              : isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                : 'text-gray-600 hover:text-violet-600 hover:bg-white'
            }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
