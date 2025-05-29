// AppointmentEditForm.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiArrowLeft, FiSave, FiCalendar, FiClock } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Define interfaces
interface TimeSlot {
  id?: number;
  startTime?: string;
  endTime?: string;
  from?: string;
  to?: string;
}

interface DayConfig {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  isActive: boolean;
  times: TimeSlot[];
}

interface AppointmentEditProps {
  appointment: {
    appointmentId: string;
    date: string;
    patientId: number;
    patientName: string;
    mode: string;
    paymentStatus: boolean;
    visitStatus: boolean;
    reason: string;
    timeFrom: string;
    timeTo: string;
    isCancelled?: boolean;
    cancelReason?: string;
  };
  userId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AppointmentEditForm: React.FC<AppointmentEditProps> = ({
  appointment,
  userId,
  onClose,
  onSuccess,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    appointmentId: appointment.appointmentId,
    mode: appointment.mode,
    reason: appointment.reason || "",
    paymentStatus: appointment.paymentStatus,
    visitStatus: appointment.visitStatus,
    isCancelled: appointment.isCancelled || false,
    cancelReason: appointment.cancelReason || "",
  });

  // Date and time state
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(appointment.date)
  );
  const [days, setDays] = useState<DayConfig[]>([]);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse the original time values
  const originalTimeFrom = appointment.timeFrom.substring(0, 5);
  const originalTimeTo = appointment.timeTo.substring(0, 5);

  // Update available times when date changes
  const updateAvailableTimes = useCallback(
    (date: Date, daysConfig: DayConfig[] = days) => {
      const dayNumber = date.getDay();
      const dayName = dayNames[dayNumber];

      // Find the day configuration to get available times
      const selectedDayConfig = daysConfig.find(
        (day) => day.dayOfWeek === dayName
      );

      if (
        selectedDayConfig &&
        selectedDayConfig.isActive &&
        selectedDayConfig.times
      ) {
        // Map the times from API format (from/to) to our component format
        const mappedTimes: TimeSlot[] = selectedDayConfig.times.map(
          (time, index) => ({
            id: index + 1,
            startTime: time.from || "",
            endTime: time.to || "",
            from: time.from,
            to: time.to,
          })
        );
        setAvailableTimes(mappedTimes);

        // Try to find the original time slot or select the first available
        const originalTimeSlot = mappedTimes.find(
          (t) =>
            (t.from === originalTimeFrom || t.startTime === originalTimeFrom) &&
            (t.to === originalTimeTo || t.endTime === originalTimeTo)
        );

        if (originalTimeSlot) {
          setSelectedTime(originalTimeSlot);
        } else if (mappedTimes.length > 0) {
          // If original time not found, select the first available time
          setSelectedTime(mappedTimes[0]);
        } else {
          setSelectedTime(null);
        }
      } else {
        setAvailableTimes([]);
        setSelectedTime(null);
      }
    },
    [days, originalTimeFrom, originalTimeTo]
  );

  // Fetch available schedule and days configuration
  const fetchScheduleData = useCallback(async () => {
    if (!userId) return;
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
        if (data.existingSetting?.length > 0) {
          const fetchedDaysFromApi = data.days || [];
          setDays(fetchedDaysFromApi);

          // Once days are loaded, update available times for the selected date
          if (selectedDate) {
            updateAvailableTimes(selectedDate, fetchedDaysFromApi);
          }
        }
      } else {
        console.error("Failed to fetch schedule data");
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  },  [userId, selectedDate, updateAvailableTimes]);

  useEffect(() => {
    if (userId) {
      fetchScheduleData();
    }
  }, [userId, fetchScheduleData]);

  // Update the input fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      name === "paymentStatus" ||
      name === "visitStatus" ||
      name === "isCancelled"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Check if a date is selectable
  const isDateSelectable = (date: Date, daysConfig: DayConfig[]) => {
    const dayNumber = date.getDay();

    const dayName = dayNames[dayNumber];

    const dayConfig = daysConfig.find((day) => day.dayOfWeek === dayName);

    return dayConfig?.isActive || false;
  };

  // Filter for date picker
  const filterDate = (date: Date) => {
    return isDateSelectable(date, days);
  };

  // Custom day rendering for the DatePicker
  const renderDayContents = (day: number, date: Date) => {
    return (
      <div
        style={{
          color: isDateSelectable(date, days) ? "inherit" : "#ccc",
          cursor: isDateSelectable(date, days) ? "pointer" : "not-allowed",
          pointerEvents: isDateSelectable(date, days) ? "auto" : "none",
        }}
      >
        {day}
      </div>
    );
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    updateAvailableTimes(date);
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Format the date to YYYY-MM-DD string
    const formattedDate = selectedDate.toISOString().split("T")[0];

    // Prepare the update data
    const updateData = {
      ...formData,
      date: formattedDate,
      timeFrom: selectedTime.from || selectedTime.startTime,
      timeTo: selectedTime.to || selectedTime.endTime,
    };

    try {
      const response = await fetch(`/api/doctor/appointments/edit/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      console.log(updateData);

      if (response.ok) {
        onSuccess(); // Refresh appointment table
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update appointment");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error updating appointment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set initial time slot when component mounts
  useEffect(() => {
    if (availableTimes.length > 0) {
      // Try to find the original time slot
      const originalTimeSlot = availableTimes.find(
        (t) =>
          (t.from === originalTimeFrom || t.startTime === originalTimeFrom) &&
          (t.to === originalTimeTo || t.endTime === originalTimeTo)
      );

      if (originalTimeSlot) {
        setSelectedTime(originalTimeSlot);
      } else {
        // If not found, set the first available time
        setSelectedTime(availableTimes[0]);
      }
    }
  }, [availableTimes, originalTimeFrom, originalTimeTo]);

  return (
    <div className="p-3">
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 mr-3 cursor-pointer"
        >
          <FiArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Appointment
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Patient Info - Display Only */}
          <div className="col-span-2 p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">
              Patient Information
            </h3>
            <p>
              <strong>Name:</strong> {appointment.patientName}
            </p>
            <p>
              <strong>Patient ID:</strong> {appointment.patientId}
            </p>
            <p>
              <strong>Appointment ID:</strong> {appointment.appointmentId}
            </p>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                filterDate={filterDate}
                renderDayContents={renderDayContents}
                dateFormat="yyyy-MM-dd"
                className="w-full p-2 border border-gray-300 rounded-md"
                showPopperArrow={false}
                minDate={new Date()}
              />
              <FiCalendar className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultation Type <span className="text-red-500">*</span>
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="online">online</option>
              <option value="offline">offline</option>
            </select>
          </div>

          {/* Time Slot Selection */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Slot <span className="text-red-500">*</span>
            </label>
            {availableTimes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTimes.map((timeSlot) => (
                  <button
                    key={timeSlot.id}
                    type="button"
                    onClick={() => setSelectedTime(timeSlot)}
                    className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 cursor-pointer ${
                      selectedTime?.id === timeSlot.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FiClock size={14} />
                    {formatTime(
                      timeSlot.from || timeSlot.startTime || ""
                    )} - {formatTime(timeSlot.to || timeSlot.endTime || "")}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-red-500">
                No time slots available for this date.
              </div>
            )}
          </div>

          {/* Reason Field */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Status Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="paymentStatus"
                  checked={formData.paymentStatus}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700">Payment Completed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="visitStatus"
                  checked={formData.visitStatus}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700">Visit Completed</span>
              </label>
            </div>
          </div>

          {/* Cancellation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isCancelled"
                  checked={formData.isCancelled}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-red-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  Cancel Appointment
                </span>
              </label>
            </div>
          </div>

          {/* Cancel Reason - Only shown if isCancelled is true */}
          {formData.isCancelled && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Reason
              </label>
              <textarea
                name="cancelReason"
                value={formData.cancelReason}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Please provide a reason for cancellation..."
              />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray 300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
            disabled={isSubmitting || !selectedDate || !selectedTime}
          >
            {isSubmitting ? (
              "Updating..."
            ) : (
              <>
                <FiSave size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentEditForm;