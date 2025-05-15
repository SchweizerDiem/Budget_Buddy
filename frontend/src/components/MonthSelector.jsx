// react imports
import { useState, useEffect } from "react";

// library imports
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

const MonthSelector = ({ onMonthChange }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    const monthStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(monthStr);
  }, [selectedDate, onMonthChange]);

  const goToPreviousMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return selectedDate.getMonth() === today.getMonth() && 
           selectedDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="month-selector">
      <div className="month-navigation">
        <button 
          onClick={goToPreviousMonth} 
          className="btn btn--dark"
          aria-label="Previous month"
        >
          <ChevronLeftIcon width={20} />
        </button>
        <h3 className="month-display">{formatMonth(selectedDate)}</h3>
        <button 
          onClick={goToNextMonth} 
          className="btn btn--dark"
          aria-label="Next month"
        >
          <ChevronRightIcon width={20} />
        </button>
      </div>
      <button 
        onClick={goToToday} 
        className="btn btn--dark today-btn"
        disabled={isCurrentMonth()}
        aria-label="Go to current month"
      >
        <CalendarDaysIcon width={20} />
        <span>Today</span>
      </button>
    </div>
  );
};

export default MonthSelector; 