import React, { useState, useEffect, useCallback } from 'react';

interface TimePickerProps {
  value: string;
  onChange: (newTime: string) => void;
  isEditing: boolean;
}

interface TimeObject {
  hours: string;
  minutes: string;
  period: 'AM' | 'PM';
}

const TimeInput: React.FC<{ time: TimeObject, onChange: (newTime: TimeObject) => void, label: string }> = ({ time, onChange, label }) => {
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHours = parseInt(e.target.value, 10);
    if (isNaN(newHours) || newHours < 1) newHours = 1;
    if (newHours > 12) newHours = 12;
    onChange({ ...time, hours: String(newHours) });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = parseInt(e.target.value, 10);
    if (isNaN(newMinutes) || newMinutes < 0) newMinutes = 0;
    if (newMinutes > 59) newMinutes = 59;
    onChange({ ...time, minutes: String(newMinutes).padStart(2, '0') });
  };
  
  const setPeriod = (period: 'AM' | 'PM') => {
    onChange({ ...time, period });
  };

  return (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <div className="flex items-center space-x-2">
          <input type="number" value={time.hours} onChange={handleHoursChange} className="w-16 text-center border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary" />
          <span>:</span>
          <input type="number" value={time.minutes} onChange={handleMinutesChange} className="w-16 text-center border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary" />
          <div className="flex rounded-md shadow-sm">
            <button type="button" onClick={() => setPeriod('AM')} className={`px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md ${time.period === 'AM' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700'}`}>AM</button>
            <button type="button" onClick={() => setPeriod('PM')} className={`px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-r-md -ml-px ${time.period === 'PM' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700'}`}>PM</button>
          </div>
        </div>
    </div>
  );
};

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, isEditing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRange, setIsRange] = useState(false);
  const [startTime, setStartTime] = useState<TimeObject>({ hours: '6', minutes: '00', period: 'AM' });
  const [endTime, setEndTime] = useState<TimeObject | null>(null);

  const parseTime = useCallback((timeStr: string): TimeObject | null => {
    if (!timeStr) return null;
    const normalizedTime = timeStr.toUpperCase().trim();
    const periodMatch = normalizedTime.match(/AM|PM/);
    if (!periodMatch) return null;
    
    const period = periodMatch[0] as 'AM' | 'PM';
    const timePart = normalizedTime.replace(period, '').trim();
    
    let [hours, minutes] = timePart.split(':');
    if (!hours) return null;

    minutes = minutes || '00';
    
    return { hours: hours.trim(), minutes: minutes.trim().padStart(2, '0'), period };
  }, []);

  useEffect(() => {
    const parts = value.split(/[–-]/).map(p => p.trim());
    const newIsRange = parts.length === 2;
    setIsRange(newIsRange);

    const parsedStart = parseTime(parts[0]);
    if (parsedStart) setStartTime(parsedStart);

    if (newIsRange) {
      const parsedEnd = parseTime(parts[1]);
      if (parsedEnd) setEndTime(parsedEnd);
    } else {
      setEndTime(null);
    }
  }, [value, parseTime]);
  
  const handleSave = () => {
    const formatTime = (time: TimeObject) => `${time.hours}:${time.minutes} ${time.period}`;
    let newValue = formatTime(startTime);
    if (isRange && endTime) {
      newValue += ` – ${formatTime(endTime)}`;
    }
    onChange(newValue);
    setIsOpen(false);
  };

  if (!isEditing) {
    return <span className="p-1">{value}</span>;
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="w-full text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 -m-1">
        {value}
      </button>
    );
  }

  return (
    <>
        <button onClick={() => setIsOpen(true)} className="w-full text-left cursor-pointer bg-gray-100 dark:bg-gray-700 rounded p-1 -m-1">
            {value}
        </button>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" onClick={() => setIsOpen(false)}>
            <div className="bg-background-light dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4 text-header-text dark:text-gray-100">সময় সম্পাদনা করুন</h3>
                <div className="space-y-4">
                    <TimeInput label="শুরুর সময়" time={startTime} onChange={setStartTime} />
                    {isRange && endTime && <TimeInput label="শেষের সময়" time={endTime} onChange={setEndTime} />}
                    <div className="flex items-center">
                        <input type="checkbox" id="isRange" checked={isRange} onChange={(e) => {
                            setIsRange(e.target.checked);
                            if(e.target.checked && !endTime) {
                                setEndTime({ hours: startTime.hours, minutes: String(parseInt(startTime.minutes) + 15), period: startTime.period });
                            }
                        }} className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"/>
                        <label htmlFor="isRange" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">এটি একটি সময়সীমা?</label>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">বাতিল</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90">সংরক্ষণ</button>
                </div>
            </div>
        </div>
    </>
  );
};

export default TimePicker;