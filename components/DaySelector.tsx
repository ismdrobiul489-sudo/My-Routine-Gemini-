import React from 'react';
import type { DayOfWeek } from '../types';
import { DAY_ORDER, BENGALI_DAYS_SHORT } from '../constants';

interface DaySelectorProps {
  currentDay: DayOfWeek;
  onDayChange: (day: DayOfWeek) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ currentDay, onDayChange }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark sticky top-[72px] z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center px-2 space-x-1 overflow-x-auto whitespace-nowrap">
        {DAY_ORDER.map((day) => {
          const isActive = day === currentDay;
          const buttonClasses = isActive
            ? 'font-bold text-accent dark:text-accent bg-green-100 dark:bg-gray-700'
            : 'font-medium text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors';

          return (
            <button
              key={day}
              className={`py-2 px-3 my-1 text-sm rounded-md ${buttonClasses}`}
              onClick={() => onDayChange(day)}
            >
              {BENGALI_DAYS_SHORT[day]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;