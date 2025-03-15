"use client";

import React, { useState } from "react";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AppointmentsSchedule = () => {
  const [interval, setInterval] = useState(10);
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { active: false, times: [{ from: "09:00 AM", to: "01:00 PM" }] };
      return acc;
    }, {} as Record<string, { active: boolean; times: { from: string; to: string }[] }> )
  );

  const toggleDay = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], active: !schedule[day].active },
    });
  };

  const updateTime = (day: string, index: number, field: "from" | "to", value: string) => {
    const updatedTimes = [...schedule[day].times];
    updatedTimes[index][field] = value;
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], times: updatedTimes },
    });
  };

  const addNewTime = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], times: [...schedule[day].times, { from: "", to: "" }] },
    });
  };

  const removeTime = (day: string, index: number) => {
    const updatedTimes = schedule[day].times.filter((_, i) => i !== index);
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], times: updatedTimes },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <label className="block text-gray-700 font-medium mb-2">Set Interval</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="border p-2 rounded w-16"
          />
          <span>Minutes</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Set Appointments Schedule</h2>
        {daysOfWeek.map((day) => (
          <div key={day} className="mb-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={schedule[day].active}
                  onChange={() => toggleDay(day)}
                  className="accent-blue-500"
                />
                <span className="font-medium text-gray-700">{day}</span>
              </label>
            </div>
            {schedule[day].active && (
              <div className="mt-2 space-y-2">
                {schedule[day].times.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={time.from}
                      onChange={(e) => updateTime(day, index, "from", e.target.value)}
                      className="border p-2 rounded"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={time.to}
                      onChange={(e) => updateTime(day, index, "to", e.target.value)}
                      className="border p-2 rounded"
                    />
                    <button
                      onClick={() => removeTime(day, index)}
                      className="text-red-500"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addNewTime(day)}
                  className="text-blue-500 text-sm"
                >
                  + Add new time
                </button>
              </div>
            )}
          </div>
        ))}
        <button className="bg-blue-500 text-white w-full py-2 rounded-md mt-4">Update</button>
      </div>
    </div>
  );
};

export default AppointmentsSchedule;
