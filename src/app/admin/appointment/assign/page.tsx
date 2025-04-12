"use client";

import Cookies from "js-cookie";
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

const generateTimeOptions = (interval: number = 10): string[] => {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const minuteFormatted = minute.toString().padStart(2, "0");
      const ampm = hour < 12 ? "AM" : "PM";
      options.push(`${hourFormatted}:${minuteFormatted} ${ampm}`);
    }
  }
  return options;
};

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onClick,
  readOnly = true,
}) => (
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

const TimeDropdown: React.FC<TimeDropdownProps> = ({
  timeOptions,
  selectedTime,
  onSelect,
}) => (
  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
    {timeOptions.map((option, i) => (
      <div
        key={i}
        className={`p-2 hover:bg-gray-100 cursor-pointer ${
          option === selectedTime ? "bg-gray-100" : ""
        }`}
        onClick={() => onSelect(option)}
      >
        {option}
      </div>
    ))}
  </div>
);

const AppointmentsSchedule: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [intervalInDb, setIntervalInDb] = useState<boolean>(false);
  const [interval, setInterval] = useState<number>(0);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>(
    interval ? String(interval) : ""
  );
  const [intervalID, setIntervalID] = useState<number | null>(null);
  const [dayss, setDayss] = useState([
    { id: 1, doctorId: 2, dayOfWeek: "Sunday", isActive: false },
    { id: 2, doctorId: 2, dayOfWeek: "Monday", isActive: false },
    { id: 3, doctorId: 2, dayOfWeek: "Tuesday", isActive: false },
    { id: 4, doctorId: 2, dayOfWeek: "Wednesday", isActive: false },
    { id: 5, doctorId: 2, dayOfWeek: "Thursday", isActive: false },
    { id: 6, doctorId: 2, dayOfWeek: "Friday", isActive: false },
    { id: 7, doctorId: 2, dayOfWeek: "Saturday", isActive: false },
  ]);


  const [schedule, setSchedule] = useState<ScheduleState>(
    dayss.reduce((acc, day) => {
      acc[day.dayOfWeek] = {
        active: day.isActive,
        times: [],
      };
      return acc;
    }, {} as ScheduleState)
  );

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    // Only make the API call if userId exists
    if (userId) {
      setIsLoading(true);
      const fetchData = async () => {
        // Define an async function inside useEffect
        try {
          const response = await fetch(
            `/api/doctor/appointments/interval/${userId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.existingSetting.length > 0) {
              const fetchedIntervalId = data.existingSetting[0].id;
              const fetchedInterval = data.existingSetting[0].intervalMinutes;
              const fetchedDays = data.days;
              console.log("Fetched days:", fetchedDays);
              setIntervalID(fetchedIntervalId);
              setInterval(fetchedInterval);
              setDayss(fetchedDays);
              setIntervalInDb(true);
              setInputValue(String(fetchedInterval));
            } else {
              setInterval(0);
              setIntervalInDb(false); 
              setInputValue(""); // Reset input value
            }
          }
        } catch (error) {
          console.error("Error fetching interval:", error);
          // Handle network errors or other exceptions
        } finally {
          setIsLoading(false); // Ensure loading state is updated regardless of success or failure
        }
      };

      fetchData(); // Call the async function
    }
  }, [userId, setIsLoading]);

  const handleSetUpdateInterval = async () => {
    if (!userId) {
      console.error("User ID not found.");
      setShowError(true); // Optionally show an error message
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/doctor/appointments/interval/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ intervalMinutes: interval }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Interval updated successfully:", data);
        setIntervalInDb(true); // Update the state to reflect that the interval is in the database
        // Optionally show a success message or update UI
      } else {
        console.error(
          "Failed to update interval:",
          data.error || response.status
        );
        setShowError(true); // Show an error message
      }
    } catch (error) {
      console.error("Error updating interval:", error);
      setShowError(true); // Show an error message for network errors
    } finally {
      setIsLoading(false);
    }
  };

  const [openDropdown, setOpenDropdown] = useState<OpenDropdownState | null>(
    null
  );

  // ✅ Prevent memory issues by guarding against zero
  useEffect(() => {
    if (interval !== null && interval > 0) {
      setTimeOptions(generateTimeOptions(interval));
    } else {
      setTimeOptions([]);
    }
  }, [interval]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fix: Cast to Element instead of Node, as 'closest' is a method on Element
      const target = event.target as Element;

      if (openDropdown && !target.closest(".time-select")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const toggleDay = (day: string): void => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], active: !schedule[day].active },
    });
  };

  const updateTime = (
    day: string,
    index: number,
    field: "from" | "to",
    value: string
  ): void => {
    const updatedTimes = [...schedule[day].times];
    updatedTimes[index][field] = value;
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], times: updatedTimes },
    });
    setOpenDropdown(null);
  };

  const addNewTime = (day: string): void => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        times: [...schedule[day].times, { from: "", to: "" }],
      },
    });
  };

  const removeTime = (day: string, index: number): void => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        times: schedule[day].times.filter((_, i) => i !== index),
      },
    });
  };

  const toggleDropdown = (
    day: string,
    index: number,
    field: "from" | "to"
  ): void => {
    setOpenDropdown(
      openDropdown?.day === day &&
        openDropdown?.index === index &&
        openDropdown?.field === field
        ? null
        : { day, index, field }
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Left Panel - Responsive Adjustments */}
      <div className="w-full md:w-1/3 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-700 font-medium mb-4">Set Interval</h3>
        <div className="flex flex-col sm:flex-row">
          <input
            type="number"
            onChange={(e) => {
              const val = e.target.value;
              setInputValue(val); // Always update the input value

              // Only update the actual interval if the value is valid
              const numVal = Number(val);
              if (numVal > 0) {
                setInterval(numVal);
                setShowError(false);
              } else if (val === "") {
                // Don't show error while typing - just don't update the interval
                setShowError(false);
              } else {
                // Show error for explicit zero or negative values
                setShowError(true);
              }
            }}
            onBlur={() => {
              // On blur, validate the input and show error if needed
              const numVal = Number(inputValue);
              if (numVal <= 0) {
                setShowError(true);
                // Reset to previous valid value or empty string
                setInputValue(interval > 0 ? String(interval) : "");
              }
            }}
            value={inputValue}
            className="border border-gray-200 p-2 rounded-t-md sm:rounded-l-md sm:rounded-tr-none w-full focus:outline-none"
            min="1"
            max="60"
          />
          <span className="bg-gray-100 p-2 rounded-b-md sm:rounded-r-md sm:rounded-l-none border border-t-0 sm:border-t border-gray-200 text-gray-600 text-center">
            Minutes
          </span>
        </div>

        {showError && (
          <p className="text-red-500 text-sm mt-1">
            Interval must be greater than 0.
          </p>
        )}
        <button
          onClick={() => {
            handleSetUpdateInterval();
          }}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto cursor-pointer"
        >
          {intervalInDb ? "Update" : "Set Interval"}
        </button>
        {!intervalInDb == true && (
          <>
            <p className="text-black-500 text-sm mt-1">NOTE:</p>
            <p className="text-black-500 text-sm mt-1">
              Add Interval value and update for setting Appointments schedule.
            </p>
          </>
        )}
      </div>

      {/* Right Panel - Responsive Adjustments */}
      {intervalInDb == true && (
        <div className="w-full md:w-2/3 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-6">
            Set Appointments Schedule
          </h2>

          {dayss.map(({ dayOfWeek }) => (
            <div
              key={dayOfWeek}
              className="py-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule[dayOfWeek].active}
                    onChange={() => toggleDay(dayOfWeek)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all"></div>
                </label>
                <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 font-medium">
                  {dayOfWeek}
                </span>
              </div>

              {schedule[dayOfWeek].active && (
                <div className="space-y-4">
                  {schedule[dayOfWeek].times.map((time, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full"
                    >
                      <div className="time-select relative w-full sm:flex-1">
                        <TimeInput
                          value={time.from}
                          onClick={() => toggleDropdown(dayOfWeek, index, "from")}
                        />
                        {openDropdown?.day === dayOfWeek &&
                          openDropdown?.index === index &&
                          openDropdown?.field === "from" && (
                            <TimeDropdown
                              timeOptions={timeOptions}
                              selectedTime={time.from}
                              onSelect={(val) =>
                                updateTime(dayOfWeek, index, "from", val)
                              }
                            />
                          )}
                      </div>
                      <span className="text-gray-500 font-light sm:mx-2">
                        to
                      </span>
                      <div className="time-select relative w-full sm:flex-1">
                        <TimeInput
                          value={time.to}
                          onClick={() => toggleDropdown(dayOfWeek, index, "to")}
                        />
                        {openDropdown?.day === dayOfWeek &&
                          openDropdown?.index === index &&
                          openDropdown?.field === "to" && (
                            <TimeDropdown
                              timeOptions={timeOptions}
                              selectedTime={time.to}
                              onSelect={(val) =>
                                updateTime(dayOfWeek, index, "to", val)
                              }
                            />
                          )}
                      </div>
                      <button
                        onClick={() => removeTime(dayOfWeek, index)}
                        className="text-red-500 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors self-end sm:self-auto"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addNewTime(dayOfWeek)}
                    className="text-gray-600 flex items-center gap-2 hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <FaPlus size={12} className="text-gray-400" />
                    <span>Add new time</span>
                  </button>
                </div>
              )}
            </div>
          ))}
          <button className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto cursor-pointer">
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSchedule;
