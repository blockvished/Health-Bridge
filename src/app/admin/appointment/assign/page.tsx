"use client";

import React, { useState, useEffect } from "react";
import { FaClock, FaPlus, FaTrash } from "react-icons/fa";

// TypeScript interfaces
interface TimeSlot {
  from: string;
  to: string;
}

interface DaySchedule {
  active: boolean;
  times: TimeSlot[];
}

interface ScheduleState {
  [key: string]: DaySchedule;
}

interface OpenDropdownState {
  day: string;
  index: number;
  field: "from" | "to";
}

interface TimeInputProps {
  value: string;
  onClick: () => void;
  readOnly?: boolean;
}

interface TimeDropdownProps {
  timeOptions: string[];
  selectedTime: string;
  onSelect: (value: string) => void;
}

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const generateTimeOptions = (interval: number = 10): string[] => {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const minuteFormatted = minute.toString().padStart(2, '0');
      const ampm = hour < 12 ? 'AM' : 'PM';
      options.push(`${hourFormatted}:${minuteFormatted} ${ampm}`);
    }
  }
  return options;
};

const TimeInput: React.FC<TimeInputProps> = ({ value, onClick, readOnly = true }) => (
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <FaClock className="text-gray-400" />
    </div>
    <input 
      type="text" 
      value={value} 
      onClick={onClick} 
      readOnly={readOnly} 
      className="border border-gray-200 p-2 pl-10 rounded-md w-full bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
    />
  </div>
);

const TimeDropdown: React.FC<TimeDropdownProps> = ({ timeOptions, selectedTime, onSelect }) => (
  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
    {timeOptions.map((option, i) => (
      <div
        key={i}
        className={`p-2 hover:bg-gray-100 cursor-pointer ${option === selectedTime ? 'bg-gray-100' : ''}`}
        onClick={() => onSelect(option)}
      >
        {option}
      </div>
    ))}
  </div>
);

const AppointmentsSchedule: React.FC = () => {
  const [interval, setInterval] = useState<number>(10);
  const [timeOptions, setTimeOptions] = useState<string[]>(generateTimeOptions(interval));
  const [schedule, setSchedule] = useState<ScheduleState>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { 
        active: day === "Sunday" || day === "Monday" || day === "Tuesday", 
        times: [{ from: "09:00 AM", to: "01:00 PM" }] 
      };
      return acc;
    }, {} as ScheduleState)
  );
  const [openDropdown, setOpenDropdown] = useState<OpenDropdownState | null>(null);

  useEffect(() => {
    setTimeOptions(generateTimeOptions(interval));
  }, [interval]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fix: Cast to Element instead of Node, as 'closest' is a method on Element
      const target = event.target as Element;
      
      if (openDropdown && !target.closest('.time-select')) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDay = (day: string): void => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], active: !schedule[day].active }
    });
  };

  const updateTime = (day: string, index: number, field: "from" | "to", value: string): void => {
    const updatedTimes = [...schedule[day].times];
    updatedTimes[index][field] = value;
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], times: updatedTimes }
    });
    setOpenDropdown(null);
  };

  const addNewTime = (day: string): void => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        times: [...schedule[day].times, { from: "", to: "" }]
      }
    });
  };

  const removeTime = (day: string, index: number): void => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        times: schedule[day].times.filter((_, i) => i !== index)
      }
    });
  };

  const toggleDropdown = (day: string, index: number, field: "from" | "to"): void => {
    setOpenDropdown(
      openDropdown?.day === day && 
      openDropdown?.index === index && 
      openDropdown?.field === field 
        ? null 
        : { day, index, field }
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-50 min-h-screen">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-700 font-medium mb-4">Set Interval</h3>
        <div className="flex">
          <input 
            type="number" 
            value={interval} 
            onChange={(e) => setInterval(Number(e.target.value))} 
            className="border border-gray-200 p-2 rounded-l-md w-full focus:outline-none" 
            min="1" 
            max="60" 
          />
          <span className="bg-gray-100 p-2 rounded-r-md border border-l-0 border-gray-200 text-gray-600">
            Minutes
          </span>
        </div>
        <button 
          onClick={() => {/* Handle update */}} 
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Update
        </button>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Set Appointments Schedule</h2>
        
        {daysOfWeek.map(day => (
          <div key={day} className="py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={schedule[day].active} 
                  onChange={() => toggleDay(day)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
              <span className="ml-3 text-gray-700 font-medium">{day}</span>
            </div>

            {schedule[day].active && (
              <div className="space-y-4">
                {schedule[day].times.map((time, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="time-select relative flex-1">
                      <TimeInput 
                        value={time.from} 
                        onClick={() => toggleDropdown(day, index, "from")} 
                      />
                      {openDropdown?.day === day && 
                       openDropdown?.index === index && 
                       openDropdown?.field === "from" && (
                        <TimeDropdown 
                          timeOptions={timeOptions} 
                          selectedTime={time.from} 
                          onSelect={(val) => updateTime(day, index, "from", val)} 
                        />
                      )}
                    </div>
                    <span className="text-gray-500 font-light">to</span>
                    <div className="time-select relative flex-1">
                      <TimeInput 
                        value={time.to} 
                        onClick={() => toggleDropdown(day, index, "to")} 
                      />
                      {openDropdown?.day === day && 
                       openDropdown?.index === index && 
                       openDropdown?.field === "to" && (
                        <TimeDropdown 
                          timeOptions={timeOptions} 
                          selectedTime={time.to} 
                          onSelect={(val) => updateTime(day, index, "to", val)} 
                        />
                      )}
                    </div>
                    <button 
                      onClick={() => removeTime(day, index)} 
                      className="text-red-500 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addNewTime(day)} 
                  className="text-gray-600 flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <FaPlus size={12} className="text-gray-400" /> 
                  <span>Add new time</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsSchedule;