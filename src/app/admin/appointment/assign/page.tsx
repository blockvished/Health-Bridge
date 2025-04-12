"use client";

import Cookies from "js-cookie";
import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTrash, FaSave, FaSpinner } from "react-icons/fa";

import {
  ScheduleState,
  OpenDropdownState,
  DayConfig,
  generateTimeOptions,
  isTimeRangeValid,
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
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: {
      [index: number]: { from: boolean; to: boolean; range: boolean };
    };
  }>({});
  const [days, setDays] = useState<DayConfig[]>([]);
  const daysOfWeekOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    console.log("days is changed");
    console.log(days);
  }, [days]);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

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

        console.log("Fetched -Appointmentsfgwedrgtertg:", data.days);
        if (data.existingSetting?.length > 0) {
          const fetchedInterval = data.existingSetting[0].intervalMinutes;
          const fetchedDaysFromApi = data.days || [];

          setInterval(fetchedInterval);

          setIntervalInDb(true);
          setInputValue(String(fetchedInterval));
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
          setDays([
            {
              id: 1,
              doctorId: 2,
              dayOfWeek: "Sunday",
              isActive: false,
              times: [],
            },
            {
              id: 2,
              doctorId: 2,
              dayOfWeek: "Monday",
              isActive: false,
              times: [],
            },
            {
              id: 3,
              doctorId: 2,
              dayOfWeek: "Tuesday",
              isActive: false,
              times: [],
            },
            {
              id: 4,
              doctorId: 2,
              dayOfWeek: "Wednesday",
              isActive: false,
              times: [],
            },
            {
              id: 5,
              doctorId: 2,
              dayOfWeek: "Thursday",
              isActive: false,
              times: [],
            },
            {
              id: 6,
              doctorId: 2,
              dayOfWeek: "Friday",
              isActive: false,
              times: [],
            },
            {
              id: 7,
              doctorId: 2,
              dayOfWeek: "Saturday",
              isActive: false,
              times: [],
            },
          ]);
        }
      } else {
        console.error("Failed to fetch interval and schedule.");
      }
    } catch (error) {
      console.error("Error fetching interval:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  useEffect(() => {
    if (interval > 0) {
      setTimeOptions(generateTimeOptions(interval));
    } else {
      setTimeOptions([]);
    }
  }, [interval]); // ... rest of your component

  const [openDropdown, setOpenDropdown] = useState<OpenDropdownState | null>(
    null
  ); // Handle clicks outside dropdown

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

  // from time cant be greater than to time
  const toggleDay = (dayOfWeek: string): void => {
    setDays((prevDays) => {
      // const sortedDays = [...prevDays].sort((a, b) => {
      //   if (a.isActive && !b.isActive) {
      //     return -1;
      //   }
      //   if (!a.isActive && b.isActive) {
      //     return 1;
      //   }
      //   const indexA = daysOfWeekOrder.indexOf(a.dayOfWeek);
      //   const indexB = daysOfWeekOrder.indexOf(b.dayOfWeek);
      //   return indexA - indexB;
      // });
      // return sortedDays.map((day) =>
      //   day.dayOfWeek === dayOfWeek ? { ...day, isActive: !day.isActive } : day
      // );
      return prevDays.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, isActive: !day.isActive } : day
      );
    });
  };

  const addNewTime = (dayOfWeek: string): void => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, times: [...(day.times || []), { from: "", to: "" }] }
          : day
      )
    );
  };

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

  const handleSetUpdateInterval = async () => {
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

  if (isLoading && !userId) {
    return (
      <div className="flex justify-center items-center h-60">
        <FaSpinner className="animate-spin text-gray-500 text-4xl" />
      </div>
    );
  }

  const submitDayTimes = async () => {
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    setIsSaving(true);

    const scheduleData = days.map(({ id, dayOfWeek, isActive, times }) => ({
      id,
      dayOfWeek,
      isActive,
      times: isActive ? times : [],
    }));

    console.log("skjhhkshg",scheduleData)

    try {
      const response = await fetch(
        `/api/doctor/appointments/times/${userId}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ schedule: scheduleData }), // Sending the 'scheduleData' which includes the 'days' information
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Schedule updated successfully");
        // Optionally show a success message to the user
      } else {
        console.error("Failed to update schedule:", data.error || response.status);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      // Optionally show an error message to the user
    } finally {
      setIsSaving(false);
    }
  };

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
            onChange={(e) => {
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
            }}
            onBlur={() => {
              const numVal = Number(inputValue);
              if (numVal <= 0) {
                setShowError(true);
                setInputValue(interval > 0 ? String(interval) : "");
              }
            }}
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
          onClick={handleSetUpdateInterval}
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
            Configure which days you're available and set your working hours for
            each day.
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
