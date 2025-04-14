"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FiCalendar, FiClock, FiSearch } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import AppointmentTable from "./AppointmentTable";

interface Patient {
  id: number;
  name: string;
  phone?: string; // Optional phone field, may be useful for display
}

// Modified TimeSlot interface to match API data
interface TimeSlot {
  id?: number; // Make id optional since API times may not have it
  startTime?: string;
  endTime?: string;
  from?: string; // Add from property to match API data
  to?: string; // Add to property to match API data
}

// Modified DayConfig to match API data format
interface DayConfig {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  isActive: boolean;
  times: TimeSlot[];
}

const Appointments = () => {
  const [patientType, setPatientType] = useState<"Old" | "New">("Old");
  const [appointmentType, setAppointmentType] = useState<"online" | "Offline">(
    "Offline"
  );
  const [patients, setPatients] = useState<Patient[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [days, setDays] = useState<DayConfig[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] =
    useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [userId]);

  const fetchData = useCallback(async () => {
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

        console.log("Fetched -Appointmentsfgwedrgtertg:", data.days);
        if (data.existingSetting?.length > 0) {
          const fetchedDaysFromApi = data.days || [];
          setDays(fetchedDaysFromApi);
        } else {
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
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  const fetchPatients = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/doctor/patients/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.Patients) {
          setPatients(data.Patients);
        } else {
          setPatients([]);
        }
      } else {
        console.error("Failed to fetch patients data");
      }
    } catch (err) {
      console.error("Error fetching patients data:", err);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    abhaId: "",
    age: "",
    weight: "",
    gender: "Male",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toString().includes(searchQuery)
  );

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientDropdownOpen(false);
  };

  // Function to check if a date is selectable (corresponds to an active day)
  const isDateSelectable = (date: Date) => {
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, etc.)
    const dayNumber = date.getDay();
    // Convert to day name to match with our days array
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[dayNumber];

    // Find the day in our days array
    const dayConfig = days.find((day) => day.dayOfWeek === dayName);

    // Check if the day is active and the date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today

    return (dayConfig?.isActive || false) && date >= today;
  };

  // Custom day rendering for the DatePicker
  const renderDayContents = (day: number, date: Date) => {
    return (
      <div
        style={{
          color: isDateSelectable(date) ? "inherit" : "#ccc",
          cursor: isDateSelectable(date) ? "pointer" : "not-allowed",
          pointerEvents: isDateSelectable(date) ? "auto" : "none",
        }}
      >
        {day}
      </div>
    );
  };

  // Create filter function for DatePicker
  const filterDate = (date: Date) => {
    return isDateSelectable(date);
  };

  // Handle date selection and update available times
  // Fixed type signature to match DatePicker's onChange prop
  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when date changes

    // Get day of week from selected date
    const dayNumber = date.getDay();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[dayNumber];

    // Find the day configuration to get available times
    const selectedDayConfig = days.find((day) => day.dayOfWeek === dayName);

    if (
      selectedDayConfig &&
      selectedDayConfig.isActive &&
      selectedDayConfig.times
    ) {
      // Map the times from API format (from/to) to our component format (startTime/endTime)
      const mappedTimes: TimeSlot[] = selectedDayConfig.times.map(
        (time, index) => ({
          id: index + 1, // Generate sequential IDs
          startTime: time.from || "",
          endTime: time.to || "",
          from: time.from,
          to: time.to,
        })
      );
      setAvailableTimes(mappedTimes);
    } else {
      setAvailableTimes([]);
    }
  };

  // Format time for display (e.g., "09:00" to "9:00 AM")
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedDate ||
      !selectedTime ||
      (patientType === "Old" && !selectedPatient)
    ) {
      setSubmitError("Please complete all required fields");
      return;
    }

    // Format the date to YYYY-MM-DD string
    const formattedDate = selectedDate.toISOString().split("T")[0];

    // Prepare the data object based on patient type
    const appointmentData = {
      date: formattedDate,
      time: {
        from: selectedTime?.from || selectedTime?.startTime, // Using optional chaining for safety
        to: selectedTime?.to || selectedTime?.endTime,     // Using optional chaining for safety
      },
      appointmentType,
      patientType,
      reason,
      doctorId: userId,
      ...(patientType === "Old"
        ? { patientId: selectedPatient?.id }
        : {
            patient: {
              ...formData,
              age: formData.age !== undefined ? parseInt(formData.age) : undefined,
              weight: formData.weight !== undefined ? parseInt(formData.weight) : undefined,
            },
          }),
    };

    console.log(appointmentData);

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch(
        `/api/doctor/appointments/create/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(appointmentData),
        }
      );

      if (response.ok) {
        // Reset form after successful submission
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedPatient(null);
        setReason("");
        setFormData({
          name: "",
          phone: "",
          email: "",
          abhaId: "",
          age: "",
          weight: "",
          gender: "Male",
        });
        setSubmitSuccess(true);
        // Optionally refresh appointment table if implemented
        // refreshAppointmentTable();
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || "Failed to create appointment");
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto gap-6 p-4 md:p-6 flex flex-col md:flex-row">
      {/* Left: Add Appointment Form */}
      <div className="bg-white shadow-md rounded-xl p-4 md:p-6 w-full md:w-1/3 mb-6 md:mb-0">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Appointment
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Date Selection */}
          <label className="text-sm text-gray-600">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="w-full mb-3">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 90))}
              filterDate={filterDate}
              renderDayContents={renderDayContents}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              calendarClassName="custom-datepicker"
              showPopperArrow={false}
            />
          </div>

          {days.length > 0 && (
            <div className="text-xs text-gray-500 mb-3">
              Active days:{" "}
              {days
                .filter((day) => day.isActive)
                .map((day) => day.dayOfWeek)
                .join(", ")}
            </div>
          )}

          {/* Time Slot Selection */}
          {selectedDate && (
            <>
              <label className="text-sm text-gray-600">
                Available Times <span className="text-red-500">*</span>
              </label>
              {availableTimes.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1 mb-4">
                  {availableTimes.map((timeSlot) => (
                    <button
                      key={timeSlot.id}
                      type="button"
                      onClick={() => setSelectedTime(timeSlot)}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        selectedTime?.id === timeSlot.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <FiClock className="text-xs" />
                      {formatTime(
                        timeSlot.startTime || timeSlot.from || ""
                      )} - {formatTime(timeSlot.endTime || timeSlot.to || "")}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 mb-4">
                  No time slots available for this date.
                </div>
              )}
            </>
          )}

          <label className="text-sm text-gray-600">
            Appointment Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="appointmentType"
                value="online"
                className="accent-blue-500"
                checked={appointmentType === "online"}
                onChange={() => setAppointmentType("online")}
              />
              Online
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="appointmentType"
                value="offline"
                className="accent-blue-500"
                checked={appointmentType === "Offline"}
                onChange={() => setAppointmentType("Offline")}
              />
              Offline
            </label>
          </div>

          <label className="text-sm text-gray-600">
            Patient Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="patientType"
                value="Old"
                className="accent-blue-500"
                checked={patientType === "Old"}
                onChange={(e) =>
                  setPatientType(e.target.value as "Old" | "New")
                }
              />
              Old
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="patientType"
                value="New"
                className="accent-blue-500"
                checked={patientType === "New"}
                onChange={(e) =>
                  setPatientType(e.target.value as "Old" | "New")
                }
              />
              New
            </label>
          </div>

          {patientType === "Old" ? (
            <>
              <label className="text-sm text-gray-600">
                Patient <span className="text-red-500">*</span>
              </label>
              <div className="relative mb-4">
                <div
                  className="w-full p-2 border border-gray-300 rounded-md mt-1 cursor-pointer flex justify-between items-center"
                  onClick={() =>
                    setIsPatientDropdownOpen(!isPatientDropdownOpen)
                  }
                >
                  {selectedPatient ? (
                    <span>
                      {selectedPatient.name} - {selectedPatient.id}
                    </span>
                  ) : (
                    <span>Select</span>
                  )}
                  <span className="text-gray-400">▼</span>
                </div>

                {isPatientDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-200">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search patients..."
                          value={searchQuery}
                          onChange={handlePatientSearch}
                          className="w-full p-2 pl-9 border border-gray-300 rounded-md"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <div
                            key={patient.id}
                            className="p-2 hover:bg-blue-50 cursor-pointer"
                            onClick={() => selectPatient(patient)}
                          >
                            {patient.name} - {patient.id}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">
                          No patients found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="pb-4">
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="abhaId"
                  className="block text-sm font-medium text-gray-700"
                >
                  ABHA ID
                </label>
                <input
                  id="abhaId"
                  name="abhaId"
                  type="text"
                  value={formData.abhaId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-2 flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                      required
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Female</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Reason Field */}
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Reason for Visit
            </label>
            <textarea
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe the reason for appointment..."
            />
          </div>

          {/* Error and Success Messages */}
          {submitError && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 border border-red-200 rounded-md">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="mb-4 p-2 bg-green-50 text-green-600 border border-green-200 rounded-md">
              Appointment created successfully!
            </div>
          )}

          <button
            type="submit"
            className={`bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2 ${
              isSubmitting ||
              !selectedDate ||
              !selectedTime ||
              (patientType === "Old" && !selectedPatient)
                ? "opacity-70 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={
              isSubmitting ||
              !selectedDate ||
              !selectedTime ||
              (patientType === "Old" && !selectedPatient)
            }
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : (
              <>
                <FiCalendar /> Add Serial
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right: Appointments Table */}
      <AppointmentTable /> 
    </div>
  );
};

export default Appointments;
