
import React, { useState, useEffect } from 'react';
import type { ActiveView } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  activeView: ActiveView;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, activeView }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const formattedDate = now.toLocaleDateString('bn-BD', options);
      setCurrentDate(formattedDate);
    };

    updateDate();
    const intervalId = setInterval(updateDate, 60 * 60 * 1000); // Update every hour

    return () => clearInterval(intervalId);
  }, []);

  const getTitle = () => {
    switch (activeView) {
      case 'routine':
        return 'সাপ্তাহিক রুটিন';
      case 'checklist':
        return 'ডোপামিন চেকলিস্ট';
      case 'today':
      default:
        return currentDate;
    }
  };

  return (
    <header className="bg-background-light dark:bg-background-dark sticky top-0 z-10 shadow-sm">
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start">
           <button 
             onClick={onMenuClick} 
             className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-header-text"
             aria-label="Open menu"
           >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
        <h1 className="text-header-text text-lg sm:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          {getTitle()}
        </h1>
        <div className="flex w-12 items-center justify-end">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-header-text gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
            <span className="material-symbols-outlined text-3xl">notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
