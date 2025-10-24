import React, { useState, useEffect } from 'react';
import type { DayOfWeek, RoutineItem } from '../types';
import { BENGALI_DAYS_POSSESSIVE } from '../constants';
import TimePicker from './TimePicker';

interface RoutineTableProps {
  day: DayOfWeek;
  routine: RoutineItem[];
  onTimeChange: (day: DayOfWeek, index: number, newTime: string) => void;
  onActivityChange: (day: DayOfWeek, index: number, newActivity: string) => void;
  onAddItem: (day: DayOfWeek) => void;
  onDeleteItem: (day: DayOfWeek, index: number) => void;
  onReorderItems: (day: DayOfWeek, reorderedRoutine: RoutineItem[]) => void;
  isToday: boolean;
}

const parseSingleTime = (timeStr: string): { hours: number, minutes: number, period?: string } => {
    const normalizedTime = timeStr.toUpperCase().trim();
    const periodMatch = normalizedTime.match(/AM|PM/);
    const period = periodMatch ? periodMatch[0] : undefined;
    const timePart = normalizedTime.replace(/AM|PM/, '').trim();
    
    let [hours, minutes] = timePart.split(':').map(Number);
    if (isNaN(hours)) hours = -1;
    if (isNaN(minutes)) minutes = 0;

    return { hours, minutes, period };
};

const convertToMinutes = (hours: number, minutes: number, period?: string): number => {
    let h = hours;
    if (period === 'PM' && h !== 12) {
        h += 12;
    } else if (period === 'AM' && h === 12) {
        h = 0;
    }
    return h * 60 + minutes;
};

const RoutineTable: React.FC<RoutineTableProps> = ({ 
  day, 
  routine, 
  onTimeChange, 
  onActivityChange, 
  onAddItem, 
  onDeleteItem,
  onReorderItems,
  isToday 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const isCurrent = (timeRange: string, nextTimeRange?: string): boolean => {
    if (timeRange.includes('–') || timeRange.includes('-')) {
        const [startTimeStr, endTimeStr] = timeRange.split(/[–-]/).map(t => t.trim());

        let start = parseSingleTime(startTimeStr);
        let end = parseSingleTime(endTimeStr);

        if (start.hours === -1 || end.hours === -1) return false;

        if (!start.period && end.period) {
            if (start.hours > end.hours && start.hours !== 12) {
                start.period = 'AM';
            } else {
                start.period = end.period;
            }
        }
        
        const startMinutes = convertToMinutes(start.hours, start.minutes, start.period);
        const endMinutes = convertToMinutes(end.hours, end.minutes, end.period);
        
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;

    } else {
        const start = parseSingleTime(timeRange);
        if(start.hours === -1) return false;

        const startMinutes = convertToMinutes(start.hours, start.minutes, start.period);

        let endMinutes = 24 * 60;

        if (nextTimeRange) {
            const [nextStartTimeStr] = nextTimeRange.split(/[–-]/).map(t => t.trim());
            const nextStart = parseSingleTime(nextStartTimeStr);

            if(nextStart.hours !== -1) {
                 const potentialEndMinutes = convertToMinutes(nextStart.hours, nextStart.minutes, nextStart.period);
                 if (potentialEndMinutes > startMinutes) {
                    endMinutes = potentialEndMinutes;
                 }
            }
        }
        
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই আইটেমটি মুছে ফেলতে চান?')) {
      onDeleteItem(day, index);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const items = [...routine];
    const [reorderedItem] = items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, reorderedItem);

    onReorderItems(day, items);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="bg-row-light dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-header-text dark:text-gray-100">{BENGALI_DAYS_POSSESSIVE[day]} রুটিন</h2>
        <button 
          onClick={() => setIsEditing(prev => !prev)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isEditing ? 'রুটিন সংরক্ষণ করুন' : 'রুটিন সম্পাদনা করুন'}
        >
          <span className="material-symbols-outlined text-header-text">
            {isEditing ? 'save' : 'edit'}
          </span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {isEditing && <th className="px-1 sm:px-2 py-2 w-10"></th>}
              <th className="px-2 sm:px-4 py-2 w-1/3 sm:w-1/4 text-xs font-medium text-gray-500 uppercase tracking-wider">সময়</th>
              <th className="px-2 sm:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">কার্যক্রম</th>
              {isEditing && <th className="px-1 sm:px-2 py-2 w-12"></th>}
            </tr>
          </thead>
          <tbody onDragOver={handleDragOver}>
            {routine.map((item, index) => {
              const isTaskCurrent = isCurrent(item.time, routine[index + 1]?.time);
              
              const rowClasses = [
                'border-b border-gray-200 dark:border-gray-700 transition-all',
                isTaskCurrent && isToday ? 'current-routine-highlight' : '',
                isEditing ? 'cursor-move' : '',
                draggedIndex === index ? 'opacity-50' : ''
              ].filter(Boolean).join(' ');

              return (
                <tr 
                  key={`${day}-${index}`} 
                  className={rowClasses}
                  draggable={isEditing}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {isEditing && (
                    <td className="border-x px-1 sm:px-2 py-2 text-center align-middle">
                      <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">drag_indicator</span>
                    </td>
                  )}
                  <td className="border-x px-2 sm:px-4 py-2 font-mono align-middle text-sm sm:text-base">
                    <div className="flex items-center">
                      {isTaskCurrent && isToday && (
                        <span className="material-symbols-outlined text-primary text-lg mr-2" aria-label="Current task">
                          schedule
                        </span>
                      )}
                      <TimePicker 
                        value={item.time}
                        onChange={(newTime) => onTimeChange(day, index, newTime)}
                        isEditing={isEditing}
                      />
                    </div>
                  </td>
                  <td
                    className="border-x px-2 sm:px-4 py-2 text-sm sm:text-base"
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onActivityChange(day, index, e.currentTarget.textContent || '')}
                  >
                    {item.activity}
                  </td>
                  {isEditing && (
                    <td className="border-x px-1 sm:px-2 py-2 text-center align-middle">
                      <button 
                        onClick={() => handleDelete(index)}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Delete item"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
          {isEditing && (
            <tfoot>
              <tr>
                <td colSpan={4} className="pt-4">
                  <button
                    onClick={() => onAddItem(day)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="material-symbols-outlined mr-2">add_circle_outline</span>
                    নতুন কার্যক্রম যোগ করুন
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default RoutineTable;