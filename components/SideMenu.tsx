import React from 'react';
import type { Theme } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onToggleTheme: () => void;
  onResetData: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenReflection: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onToggleTheme, 
  onResetData,
  isFocusMode,
  onToggleFocusMode,
  onOpenReflection
}) => {
  const handlePrint = () => {
    window.print();
    onClose();
  };
  
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-background-light dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id="menu-title" className="text-lg font-bold text-header-text dark:text-gray-100">
              মেনু
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-grow p-4 space-y-1">
            <h3 className="px-2 pt-2 pb-1 text-xs font-bold text-gray-500 uppercase">View Options</h3>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <div className="flex items-center">
                    <span className="material-symbols-outlined mr-3">center_focus_weak</span>
                    <span>ফোকাস মোড</span>
                </div>
                <button
                    onClick={onToggleFocusMode}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isFocusMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isFocusMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            
            <h3 className="px-2 pt-4 pb-1 text-xs font-bold text-gray-500 uppercase">Tools</h3>
             <button
                onClick={onOpenReflection}
                className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
                <span className="material-symbols-outlined mr-3">edit_note</span>
                <span>রিফ্লেকশন লিখুন</span>
            </button>
            <button
                onClick={handlePrint}
                className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
                <span className="material-symbols-outlined mr-3">print</span>
                <span>রুটিন প্রিন্ট করুন</span>
            </button>


            <h3 className="px-2 pt-4 pb-1 text-xs font-bold text-gray-500 uppercase">Settings</h3>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <div className="flex items-center">
                    <span className="material-symbols-outlined mr-3">{currentTheme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
                    <span>থিম</span>
                </div>
                <button
                    onClick={onToggleTheme}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${currentTheme === 'dark' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${currentTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            <button
                onClick={onResetData}
                className="w-full flex items-center p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
                <span className="material-symbols-outlined mr-3">delete_forever</span>
                <span>ডেটা রিসেট করুন</span>
            </button>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
             <h3 className="font-bold text-center">My Routine</h3>
             <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">v1.1.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;