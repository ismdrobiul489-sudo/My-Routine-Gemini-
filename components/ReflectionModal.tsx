import React, { useState, useEffect } from 'react';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  initialText: string;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose, onSave, initialText }) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-header-text dark:text-gray-100">আজকের রিফ্লেকশন</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="আজকের দিনটি কেমন ছিল? কী কী ভালো হয়েছে বা কী উন্নত করা যেত..."
          className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition"
        ></textarea>
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            বাতিল
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionModal;