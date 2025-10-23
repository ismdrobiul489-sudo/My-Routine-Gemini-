import React, { useMemo, useState } from 'react';
import type { ChecklistItem } from '../types';

interface DopamineChecklistProps {
  checklist: ChecklistItem[];
  onChecklistChange: (index: number, checked: boolean) => void;
  onScoreChange: (index: number, score: number) => void;
  onTaskChange: (index: number, newTask: string) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

const DopamineChecklist: React.FC<DopamineChecklistProps> = ({ 
  checklist, 
  onChecklistChange, 
  onScoreChange,
  onTaskChange,
  onAddItem,
  onDeleteItem,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const totalScore = useMemo(() => {
    return checklist.reduce((total, item) => {
      if (item.checked) {
        return total + (item.score || 0);
      }
      return total;
    }, 0);
  }, [checklist]);

  const handleDelete = (index: number) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই কাজটি মুছে ফেলতে চান?')) {
      onDeleteItem(index);
    }
  };

  const getScoreExplanationClasses = (scoreRange: 'high' | 'good' | 'medium' | 'low') => {
    let isActive = false;
    if (scoreRange === 'high' && totalScore >= 25) isActive = true;
    if (scoreRange === 'good' && totalScore >= 20 && totalScore < 25) isActive = true;
    if (scoreRange === 'medium' && totalScore >= 15 && totalScore < 20) isActive = true;
    if (scoreRange === 'low' && totalScore < 15 && totalScore > 0) isActive = true;
    
    return `p-2 rounded transition-all text-sm sm:text-base ${isActive ? 'font-bold bg-gray-200 dark:bg-gray-600' : ''}`;
  };

  return (
    <div className="pt-8">
      <div className="flex justify-between items-center pb-2">
        <div>
          <h3 className="text-header-text dark:text-gray-100 text-lg sm:text-xl font-bold leading-tight tracking-[-0.015em]">দৈনিক ডোপামিন চেকলিস্ট</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">প্রতিদিন রাতে ৫ মিনিটে নিজের স্কোর দেবে (১ থেকে ৫ পর্যন্ত):</p>
        </div>
        <button 
          onClick={() => setIsEditing(prev => !prev)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isEditing ? 'চেকলিস্ট সংরক্ষণ করুন' : 'চেকলিস্ট সম্পাদনা করুন'}
        >
          <span className="material-symbols-outlined text-header-text">
            {isEditing ? 'save' : 'edit'}
          </span>
        </button>
      </div>
      <div className="bg-row-light dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm">
        {/* Responsive Header */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto] sm:gap-x-6 px-2 py-3 border-b dark:border-gray-700">
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">কাজ</div>
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 text-center">আজ করেছি?</div>
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 text-center">স্কোর</div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {checklist.map((item, index) => (
            <div key={item.id} className="py-4 px-2 grid grid-cols-2 sm:grid-cols-[1fr_auto_auto] sm:gap-x-6 items-center group relative">
              <div className="col-span-2 sm:col-span-1 flex items-center justify-between">
                <p 
                  className={`text-sm sm:text-base flex-grow ${isEditing ? 'focus:bg-gray-100 dark:focus:bg-gray-700 outline-none rounded p-1 -m-1' : ''}`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onTaskChange(index, e.currentTarget.textContent || '')}
                >
                  {item.task}
                </p>
                {isEditing && (
                  <button 
                    onClick={() => handleDelete(index)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors ml-2"
                    aria-label="Delete item"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                )}
              </div>
              
              <div className="mt-3 sm:mt-0 flex items-center justify-start sm:justify-center">
                <label htmlFor={`check-${index}`} className="sm:hidden text-xs text-gray-500 mr-2 uppercase">আজ করেছি?</label>
                <input
                  id={`check-${index}`}
                  type="checkbox"
                  className="h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={item.checked}
                  onChange={(e) => onChecklistChange(index, e.target.checked)}
                />
              </div>

              <div className="mt-3 sm:mt-0 flex items-center justify-end sm:justify-center">
                <label htmlFor={`score-${index}`} className="sm:hidden text-xs text-gray-500 mr-2 uppercase">স্কোর:</label>
                <input
                  id={`score-${index}`}
                  type="number"
                  min="1"
                  max="5"
                  value={item.score}
                  onChange={(e) => onScoreChange(index, parseInt(e.target.value, 10) || 1)}
                  className="w-16 text-center border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary"
                  disabled={!item.checked}
                />
              </div>
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="pt-4 mt-2 border-t dark:border-gray-700">
            <button
              onClick={onAddItem}
              className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined mr-2">add_circle_outline</span>
              নতুন কাজ যোগ করুন
            </button>
          </div>
        )}
        <div className="mt-4 text-right border-t dark:border-gray-700 pt-4">
          <span className="text-base sm:text-lg font-bold">মোট স্কোর: <span className="text-primary">{totalScore}</span></span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-row-light dark:bg-gray-800 rounded-lg shadow-sm">
        <h4 className="text-md sm:text-lg font-semibold mb-2">স্কোর ব্যাখ্যা:</h4>
        <div className="space-y-1">
          <p className={`text-blue-500 dark:text-blue-400 ${getScoreExplanationClasses('high')}`}>🔵 25–30 = একদম ব্যালেন্সড ডোপামিন</p>
          <p className={`text-green-500 dark:text-green-400 ${getScoreExplanationClasses('good')}`}>🟢 20–25 = ভালো, মনোযোগ টিকছে</p>
          <p className={`text-yellow-500 dark:text-yellow-400 ${getScoreExplanationClasses('medium')}`}>🟡 15–20 = মাঝারি, কিছু অংশ ঠিক করতে হবে</p>
          <p className={`text-red-500 dark:text-red-400 ${getScoreExplanationClasses('low')}`}>🔴 নিচে 15 = ডোপামিন ইমব্যালান্স, পরের দিন স্ক্রিন কমাও</p>
        </div>
      </div>
    </div>
  );
};

export default DopamineChecklist;