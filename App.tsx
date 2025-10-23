import React, { useState, useEffect, useCallback } from 'react';
import type { DayOfWeek, Routines, ChecklistItem, Theme, RoutineItem } from './types';
import { INITIAL_ROUTINES, INITIAL_CHECKLIST_ITEMS, DAY_ORDER } from './constants';
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import RoutineTable from './components/RoutineTable';
import DopamineChecklist from './components/DopamineChecklist';
import SideMenu from './components/SideMenu';
import ReflectionModal from './components/ReflectionModal';

const App: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<DayOfWeek>('saturday');
  const [routines, setRoutines] = useState<Routines>(INITIAL_ROUTINES);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [reflection, setReflection] = useState('');

  const getTodayKey = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    // Set theme from local storage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    // Set current day on initial load
    const todayIndex = new Date().getDay();
    const today: DayOfWeek = DAY_ORDER[todayIndex];
    setCurrentDay(today);

    // Load routines from local storage
    const savedRoutines = localStorage.getItem('routines');
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }

    const todayKey = getTodayKey();

    // Load checklist and reflection from local storage for the current day
    const savedChecklist = localStorage.getItem(`checklist-${todayKey}`);
    const savedGlobalChecklist = localStorage.getItem('checklist-global');

    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else if (savedGlobalChecklist) {
       const globalChecklist = JSON.parse(savedGlobalChecklist);
       setChecklist(
        globalChecklist.map((item: ChecklistItem) => ({
          ...item,
          checked: false,
          score: 1,
        }))
      );
    } else {
      setChecklist(
        INITIAL_CHECKLIST_ITEMS.map((item) => ({
          ...item,
          checked: false,
          score: 1,
        }))
      );
    }
    
    const savedReflection = localStorage.getItem(`reflection-${todayKey}`);
    if(savedReflection) {
      setReflection(savedReflection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    if(checklist.length > 0) {
      const todayKey = getTodayKey();
      localStorage.setItem(`checklist-${todayKey}`, JSON.stringify(checklist));
      
      const globalChecklist = checklist.map(({ task, id }) => ({ task, id }));
      localStorage.setItem('checklist-global', JSON.stringify(globalChecklist));
    }
  }, [checklist]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const handleResetData = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা পুনরায় সেট করতে চান? এই ක්‍රিয়াটি ফেরানো যাবে না।')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  const handleSaveReflection = (text: string) => {
    const todayKey = getTodayKey();
    localStorage.setItem(`reflection-${todayKey}`, text);
    setReflection(text);
    setIsReflectionOpen(false);
  }

  const handleTimeChange = useCallback((day: DayOfWeek, index: number, newTime: string) => {
    setRoutines(prevRoutines => {
      const newRoutineForDay = [...prevRoutines[day]];
      newRoutineForDay[index] = { ...newRoutineForDay[index], time: newTime };
      return { ...prevRoutines, [day]: newRoutineForDay };
    });
  }, []);

  const handleActivityChange = useCallback((day: DayOfWeek, index: number, newActivity: string) => {
    setRoutines(prevRoutines => {
      const newRoutineForDay = [...prevRoutines[day]];
      newRoutineForDay[index] = { ...newRoutineForDay[index], activity: newActivity };
      return { ...prevRoutines, [day]: newRoutineForDay };
    });
  }, []);

  const handleAddItem = useCallback((day: DayOfWeek) => {
    setRoutines(prevRoutines => {
      const newRoutineForDay = [...prevRoutines[day]];
      newRoutineForDay.push({ time: '11:30 PM', activity: 'নতুন কার্যক্রম' });
      return { ...prevRoutines, [day]: newRoutineForDay };
    });
  }, []);

  const handleDeleteItem = useCallback((day: DayOfWeek, index: number) => {
    setRoutines(prevRoutines => {
      const newRoutineForDay = [...prevRoutines[day]];
      newRoutineForDay.splice(index, 1);
      return { ...prevRoutines, [day]: newRoutineForDay };
    });
  }, []);

  const handleReorderItems = useCallback((day: DayOfWeek, reorderedRoutine: RoutineItem[]) => {
    setRoutines(prevRoutines => ({
      ...prevRoutines,
      [day]: reorderedRoutine,
    }));
  }, []);

  const handleChecklistChange = useCallback((index: number, checked: boolean) => {
    setChecklist(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], checked };
      return newList;
    });
  }, []);

  const handleScoreChange = useCallback((index: number, score: number) => {
    setChecklist(prev => {
      const newList = [...prev];
      const newScore = Math.max(1, Math.min(5, score));
      newList[index] = { ...newList[index], score: newScore };
      return newList;
    });
  }, []);
  
  const handleChecklistTaskChange = useCallback((index: number, newTask: string) => {
    setChecklist(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], task: newTask };
      return newList;
    });
  }, []);

  const handleAddChecklistItem = useCallback(() => {
    setChecklist(prev => [
      ...prev,
      {
        id: `cl-${Date.now()}`,
        task: 'নতুন কাজ',
        checked: false,
        score: 1,
      },
    ]);
  }, []);

  const handleDeleteChecklistItem = useCallback((index: number) => {
    setChecklist(prev => {
      const newList = [...prev];
      newList.splice(index, 1);
      return newList;
    });
  }, []);

  const isViewingToday = currentDay === DAY_ORDER[new Date().getDay()];

  return (
    <div className={`relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden ${isFocusMode ? 'focus-mode' : ''}`}>
      {isFocusMode && (
        <button
          onClick={() => setIsFocusMode(false)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-background-light dark:bg-gray-700 shadow-lg text-header-text hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="ফোকাস মোড বন্ধ করুন"
        >
          <span className="material-symbols-outlined">close_fullscreen</span>
        </button>
      )}

      <div className="side-menu-container">
        <SideMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)}
          currentTheme={theme}
          onToggleTheme={toggleTheme}
          onResetData={handleResetData}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
          onOpenReflection={() => setIsReflectionOpen(true)}
        />
      </div>
      
      <ReflectionModal 
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
        onSave={handleSaveReflection}
        initialText={reflection}
      />

      {!isFocusMode && <Header onMenuClick={() => setIsMenuOpen(true)} />}
      <div className="day-selector-container">
        <DaySelector currentDay={currentDay} onDayChange={setCurrentDay} />
      </div>

      <main className="px-4 space-y-2 pb-24 pt-6 flex-grow">
        <div className="routine-table-container">
          <RoutineTable
            day={currentDay}
            routine={routines[currentDay]}
            onTimeChange={handleTimeChange}
            onActivityChange={handleActivityChange}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onReorderItems={handleReorderItems}
            isToday={isViewingToday}
          />
        </div>
        {!isFocusMode && (
          <div className="dopamine-checklist-container">
            <DopamineChecklist
              checklist={checklist}
              onChecklistChange={handleChecklistChange}
              onScoreChange={handleScoreChange}
              onTaskChange={handleChecklistTaskChange}
              onAddItem={handleAddChecklistItem}
              onDeleteItem={handleDeleteChecklistItem}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;