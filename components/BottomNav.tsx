
import React from 'react';
import type { ActiveView } from '../types';

interface BottomNavProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-primary dark:text-green-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400';
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center flex-grow p-2 transition-colors duration-200 focus:outline-none"
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={`material-symbols-outlined transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
        {icon}
      </span>
      <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
        {label}
      </span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 bg-background-light/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around max-w-lg mx-auto">
        <NavItem
          label="আজ"
          icon="today"
          isActive={activeView === 'today'}
          onClick={() => onNavigate('today')}
        />
        <NavItem
          label="রুটিন"
          icon="calendar_month"
          isActive={activeView === 'routine'}
          onClick={() => onNavigate('routine')}
        />
        <NavItem
          label="চেকলিস্ট"
          icon="checklist"
          isActive={activeView === 'checklist'}
          onClick={() => onNavigate('checklist')}
        />
      </div>
    </footer>
  );
};

export default BottomNav;
