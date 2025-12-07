import React, { useState, useEffect, useRef } from 'react';

interface DatePickerInputProps {
  id: string;
  value: string; // Expects "YYYY-MM-DD"
  onChange: (value: string) => void;
}

// Helper to format "YYYY-MM-DD" to "MM/DD/YYYY" for display
const formatForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`;
};

const DatePickerInput: React.FC<DatePickerInputProps> = ({ id, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState(value ? new Date(value + 'T00:00:00') : new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync display date with external value changes
    setDisplayDate(value ? new Date(value + 'T00:00:00') : new Date());
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDayClick = (day: number) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(newDate.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  const changeMonth = (offset: number) => {
    setDisplayDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const selectedDate = value ? new Date(value + 'T00:00:00') : null;

    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} />);
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isSelected = selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

      return (
        <div
          key={`day-${day}`}
          onClick={() => handleDayClick(day)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer ${
            isSelected ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
          }`}
        >
          {day}
        </div>
      );
    });

    return (
      <div className="absolute z-10 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
        <div className="flex justify-between items-center mb-2">
          <button type="button" onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-100">&lt;</button>
          <span className="font-semibold text-sm">
            {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button type="button" onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-100">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {blanks}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="relative mt-1" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          id={id}
          value={formatForDisplay(value)}
          onFocus={() => setIsOpen(true)}
          readOnly
          className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002 2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {isOpen && renderCalendar()}
    </div>
  );
};

export default DatePickerInput;
