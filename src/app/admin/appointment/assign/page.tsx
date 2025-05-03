"use client";

import Cookies from "js-cookie";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaTrash, FaSave, FaSpinner } from "react-icons/fa";

import {
  OpenDropdownState,
  DayConfig,
  generateTimeOptions,
} from "./utils";
import TimeDropdown from "./TimeDropdown";
import TimeInput from "./TimeInput";

const AppointmentsSchedule: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [intervalInDb, setIntervalInDb] = useState<boolean>(false);
  const [interval, setInterval] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [days, setDays] = useState<DayConfig[]>([]);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdownState | null>(null);
  
  // Define days of week order as a memoized constant
  const daysOfWeekOrder = useMemo(() => [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ], []);
  
  // Generate time options based on interval
  const timeOptions = useMemo(() => {
    return interval > 0 ? generateTimeOptions(interval) : [];
  }, [interval]);
  
  // Initialize validation errors state with a more structured approach
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: {
      [index: number]: { from: boolean; to: boolean; range: boolean };
    };
  }>({});

  // Validate time ranges for all days
  const validateTimes = useCallback(() => {
    const errors: {
      [key: string]: {
        [index: number]: { from: boolean; to: boolean; range: boolean };
      };
    } = {};
    
    days.forEach(day => {
      if (day.isActive && day.times && day.times.length > 0) {
        day.times.forEach((time, index) => {
          const fromTime = time.from;
          const toTime = time.to;
          
          if (!errors[day.dayOfWeek]) {
            errors[day.dayOfWeek] = {};
          }
          
          if (!errors[day.dayOfWeek][index]) {
            errors[day.dayOfWeek][index] = { from: false, to: false, range: false };
          }
          
          // Validate both times are set
          errors[day.dayOfWeek][index].from = !fromTime;
          errors[day.dayOfWeek][index].to = !toTime;
          
          // Validate from time is before to time
          if (fromTime && toTime) {
            const [fromHours, fromMinutes] = fromTime.split(':').map(Number);
            const [toHours, toMinutes] = toTime.split(':').map(Number);
            const fromValue = fromHours * 60 + fromMinutes;
            const toValue = toHours * 60 + toMinutes;
            
            errors[day.dayOfWeek][index].range = fromValue >= toValue;
          }
        });
      }
    });
    
    setValidationErrors(errors);
    
    // Check if there are any validation errors
    return !Object.values(errors).some(dayErrors => 
      Object.values(dayErrors).some(timeErrors => 
        timeErrors.from || timeErrors.to || timeErrors.range
      )
    );
  }, [days]);

  // Log days changes
  useEffect(() => {
    console.log("days is changed");
    console.log(days);
  }, [days]);

  // Get user ID from cookie
  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  // Initialize default days data
  const getDefaultDays = useCallback(() => {
    return daysOfWeekOrder.map((day, index) => ({
      id: index + 1,
      doctorId: 2,
      dayOfWeek: day,
      isActive: false,
      times: [],
    }));
  }, [daysOfWeekOrder]);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
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

        console.log("Fetched Appointments:", data.days);
        if (data.existingSetting?.length > 0) {
          const fetchedInterval = data.existingSetting[0].intervalMinutes;
          const fetchedDaysFromApi = data.days || [];

          setInterval(fetchedInterval);
          setIntervalInDb(true);
          setInputValue(String(fetchedInterval));
          
          // Sort days by active status and then by order of week
          const sortedDays = [...fetchedDaysFromApi].sort((a, b) => {
            if (a.isActive && !b.isActive) {
              return -1;
            }
            if (!a.isActive && b.isActive) {
              return 1;
            }
            const indexA = daysOfWeekOrder.indexOf(a.dayOfWeek);
            const indexB = daysOfWeekOrder.indexOf(b.dayOfWeek);
            return indexA - indexB;
          });
          
          setDays(sortedDays);
        } else {
          setInterval(0);
          setIntervalInDb(false);
          setInputValue("");
          setDays(getDefaultDays());
        }
      } else {
        console.error("Failed to fetch interval and schedule.");
      }
    } catch (error) {
      console.error("Error fetching interval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, daysOfWeekOrder, getDefaultDays]);

  // Initial data fetch when userId is available
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (openDropdown && !target.closest(".time-select")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Toggle day active status
  const toggleDay = (dayOfWeek: string): void => {
    setDays((prevDays) => {
      return prevDays.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, isActive: !day.isActive } : day
      );
    });
  };

  // Add new time slot to a day
  const addNewTime = (dayOfWeek: string): void => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, times: [...(day.times || []), { from: "", to: "" }] }
          : day
      )
    );
  };

  // Remove time slot from a day
  const removeTime = (dayOfWeek: string, index: number): void => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              times: (day.times || []).filter((_, i) => i !== index),
            }
          : day
      )
    );
  };

  // Toggle dropdown for time selection
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

  // Update time value in a time slot
  const updateTime = (
    dayOfWeek: string,
    index: number,
    field: "from" | "to",
    value: string
  ): void => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              times: (day.times || []).map((time, i) =>
                i === index ? { ...time, [field]: value } : time
              ),
            }
          : day
      )
    );
  };

  // Handle interval update
  const handleUpdateInterval = async () => {
    if (!userId) {
      setShowError(true);
      return;
    }

    if (!interval || interval <= 0) {
      setShowError(true);
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
        setIntervalInDb(true);

        // If we're setting interval for the first time, fetch data again
        if (!intervalInDb) {
          await fetchData();
        }
      } else {
        console.error(
          "Failed to update interval:",
          data.error || response.status
        );
        setShowError(true);
      }
    } catch (error) {
      console.error("Error updating interval:", error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit day schedule
  const submitDayTimes = async () => {
    if (!userId) {
      console.error("User ID not found.");
      return;
    }
    
    // Validate time slots before submitting
    const isValid = validateTimes();
    if (!isValid) {
      alert("Please fix the time slot errors before saving.");
      return;
    }
    
    // Check if all active days have time slots
    const activeDays = days.filter(day => day.isActive);
    const missingTimeSlots = activeDays.some(day => !day.times || day.times.length === 0);
    
    if (missingTimeSlots) {
      alert("All active days must have at least one time slot.");
      return;
    }
    
    setIsSaving(true);
    
    const scheduleData = days.map(({ id, dayOfWeek, isActive, times }) => ({
      id,
      dayOfWeek,
      isActive,
      times: isActive ? times : [],
    }));
  
    try {
      const response = await fetch(
        `/api/doctor/appointments/times/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ schedule: scheduleData }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("Schedule updated successfully");
        alert("Schedule updated successfully!");
      } else {
        console.error("Failed to update schedule:", data.error || response.status);
        alert("Failed to update schedule. Please try again.");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("An error occurred while updating the schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle interval input change
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const numVal = Number(val);
    if (numVal > 0) {
      setInterval(numVal);
      setShowError(false);
    } else if (val === "") {
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  // Handle interval input blur
  const handleIntervalBlur = () => {
    const numVal = Number(inputValue);
    if (numVal <= 0) {
      setShowError(true);
      setInputValue(interval > 0 ? String(interval) : "");
    }
  };

  // Loading state
  if (isLoading && !userId) {
    return (
      <div className="flex justify-center items-center h-60">
        <FaSpinner className="animate-spin text-gray-500 text-4xl" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Left Panel - Interval Setting */}
      <div className="w-full md:w-1/3 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-700 font-medium mb-4">
          Set Appointment Interval
        </h3>
        <div className="flex flex-col sm:flex-row">
          <input
            type="number"
            onChange={handleIntervalChange}
            onBlur={handleIntervalBlur}
            value={inputValue}
            className={`border ${
              showError ? "border-red-300" : "border-gray-200"
            } p-2 rounded-t-md sm:rounded-l-md sm:rounded-tr-none w-full focus:outline-none focus:ring-2 ${
              showError ? "focus:ring-red-500" : "focus:ring-blue-500"
            } focus:border-transparent transition-colors`}
            min="1"
            max="60"
            placeholder="Enter minutes"
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
          onClick={handleUpdateInterval}
          disabled={isLoading || !inputValue || Number(inputValue) <= 0}
          className={`mt-4 ${
            isLoading || !inputValue || Number(inputValue) <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } 
            text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto flex items-center justify-center gap-2`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>{intervalInDb ? "Update Interval" : "Set Interval"}</>
          )}
        </button>

        {!intervalInDb && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-3">
            <p className="text-blue-800 text-sm font-medium">How it works:</p>
            <ol className="text-blue-700 text-sm mt-1 list-decimal pl-5 space-y-1">
              <li>
                Set the appointment interval in minutes (e.g., 15, 30, 60)
              </li>
              <li>This determines how frequently appointments can be booked</li>
              <li>
                After setting the interval, you can configure your schedule
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Right Panel - Schedule Setting */}
      {intervalInDb && (
        <div className="w-full md:w-2/3 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-4">
            Set Appointments Schedule
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {`Configure which days you're available and set your working hours for
            each day.`}
          </p>

          <div className="max-h-[500px] overflow-y-auto pr-2 -mr-2">
            {days.map(({ dayOfWeek, isActive, times }) => {
              return (
                <div
                  key={dayOfWeek}
                  className="py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleDay(dayOfWeek)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all"></div>
                      </label>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 font-medium">
                        {dayOfWeek}
                      </span>
                    </div>

                    {isActive && (
                      <button
                        onClick={() => addNewTime(dayOfWeek)}
                        className="text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors text-sm sm:text-base cursor-pointer"
                      >
                        <FaPlus size={12} />
                        <span className="hidden sm:inline">Add time slot</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    )}
                  </div>

                  {isActive && (
                    <div className="space-y-4">
                      {times?.length === 0 && (
                        <p className="text-amber-500 text-sm italic">
                          Please add at least one time slot for this day.
                        </p>
                      )}
                      
                      {times?.map((time, index) => (
                        <div
                          key={index}
                          className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full p-3 rounded-lg ${
                            validationErrors[dayOfWeek]?.[index]?.range
                              ? "bg-red-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="time-select relative w-full sm:flex-1">
                            <TimeInput
                              value={time.from}
                              onClick={() =>
                                toggleDropdown(dayOfWeek, index, "from")
                              }
                              placeholder="Start time"
                              hasError={
                                validationErrors[dayOfWeek]?.[index]?.from
                              }
                            />
                            {openDropdown?.day === dayOfWeek &&
                              openDropdown.index === index &&
                              openDropdown.field === "from" && (
                                <TimeDropdown
                                  timeOptions={timeOptions}
                                  selectedTime={time.from}
                                  onSelect={(val) =>
                                    updateTime(dayOfWeek, index, "from", val)
                                  }
                                  onClose={() => setOpenDropdown(null)}
                                />
                              )}
                          </div>

                          <span className="text-gray-500 font-light sm:mx-2 self-center">
                            to
                          </span>

                          <div className="time-select relative w-full sm:flex-1">
                            <TimeInput
                              value={time.to}
                              onClick={() =>
                                toggleDropdown(dayOfWeek, index, "to")
                              }
                              placeholder="End time"
                              hasError={
                                validationErrors[dayOfWeek]?.[index]?.to
                              }
                            />
                            {openDropdown?.day === dayOfWeek &&
                              openDropdown.index === index &&
                              openDropdown.field === "to" && (
                                <TimeDropdown
                                  timeOptions={timeOptions}
                                  selectedTime={time.to}
                                  onSelect={(val) =>
                                    updateTime(dayOfWeek, index, "to", val)
                                  }
                                  onClose={() => setOpenDropdown(null)}
                                />
                              )}
                          </div>

                          <button
                            onClick={() => removeTime(dayOfWeek, index)}
                            className="text-red-500 bg-white border border-red-200 p-2 rounded-full hover:bg-red-50 transition-colors self-end sm:self-auto cursor-pointer"
                            title="Remove time slot"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}

                      {validationErrors[dayOfWeek] &&
                        Object.values(validationErrors[dayOfWeek]).some(
                          (error) => error.range
                        ) && (
                          <p className="text-red-500 text-sm mt-1">
                            Start time must be earlier than end time in all
                            slots.
                          </p>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className={`${
                isSaving ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              } 
                text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2`}
              onClick={submitDayTimes}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Save Schedule</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSchedule;