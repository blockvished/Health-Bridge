import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  TimeSlot,
  ClinicData,
  AvailabilityData,
  ConsultationData,
  BookingFormData,
} from "./doctor";

type RegistrationFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type LoginFormData = {
  emailOrPhone: string;
  password: string;
};

type BookingAppointmentProps = {
  times: AvailabilityData[];
  consultation: ConsultationData;
  clinics: ClinicData[];
  doctorId: number;
  doctorName: string;
};

export default function BookingAppointment({
  times,
  consultation,
  clinics,
  doctorId,
  doctorName,
}: BookingAppointmentProps) {
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    consultationMode: "",
    clinicId: "",
    date: "",
    timeSlot: "",
  });
  const [registrationForm, setRegistrationForm] =
    useState<RegistrationFormData>({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    emailOrPhone: "",
    password: "",
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentStep, setCurrentStep] = useState<"booking" | "auth">("booking");
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format time from 24h to 12h format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get active days for date picker
  const getActiveDays = () => {
    return times.filter((day) => day.isActive);
  };

  // Check if a date is available for booking
  const isDateAvailable = (dateString: string) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const activeDays = getActiveDays();
    return activeDays.some((day) => day.dayOfWeek === dayName);
  };

  // Handle date change and update available time slots
  const handleDateChange = (selectedDate: string) => {
    setBookingForm((prev) => ({ ...prev, date: selectedDate, timeSlot: "" }));
    setShowDatePicker(false);

    if (selectedDate) {
      const date = new Date(selectedDate);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayAvailability = times.find((day) => day.dayOfWeek === dayName);

      if (dayAvailability && dayAvailability.isActive) {
        setAvailableTimeSlots(dayAvailability.times);
      } else {
        setAvailableTimeSlots([]);
      }
    } else {
      setAvailableTimeSlots([]);
    }
  };

  // Handle booking form submission (Continue button)
  const handleBookingFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields

    if (
      !bookingForm.consultationMode ||
      !bookingForm.date ||
      !bookingForm.timeSlot ||
      (bookingForm.consultationMode === "offline" && !bookingForm.clinicId)
    ) {
      alert("Please fill in all required fields");

      return;
    }

    // Move to auth step

    setCurrentStep("auth");
  };

  // Handle registration form submission
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !registrationForm.name ||
      !registrationForm.phone ||
      !registrationForm.password
    ) {
      alert("Please fill in all required fields");

      return;
    }

    if (!isNotRobot) {
      alert("Please verify that you are not a robot");

      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for new appointment API

      const appointmentData = {
        date: bookingForm.date,

        timeSlot: bookingForm.timeSlot,

        consultationMode: bookingForm.consultationMode,

        doctorId: doctorId,

        clinicId: bookingForm.clinicId,

        consultationFees: consultation.consultationFees,

        // Registration data

        name: registrationForm.name,

        email: registrationForm.email,

        phone: registrationForm.phone,

        password: registrationForm.password,
      };

      console.log("Sending new appointment data:", appointmentData);

      const response = await fetch("/api/public/appointment/new", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Appointment booked successfully!");

        // Reset forms

        setBookingForm({
          consultationMode: "",

          clinicId: "",

          date: "",

          timeSlot: "",
        });

        setRegistrationForm({
          name: "",

          email: "",

          phone: "",

          password: "",
        });

        setCurrentStep("booking");

        setIsNotRobot(false);
      } else {
        alert("Failed to book appointment: " + result.error);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);

      alert("An error occurred while booking the appointment");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.emailOrPhone || !loginForm.password) {
      alert("Please fill in all required fields");

      return;
    }

    if (!isNotRobot) {
      alert("Please verify that you are not a robot");

      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for existing appointment API

      const appointmentData = {
        date: bookingForm.date,

        timeSlot: bookingForm.timeSlot,

        consultationMode: bookingForm.consultationMode,

        doctorId: doctorId,

        clinicId: bookingForm.clinicId,

        consultationFees: consultation.consultationFees,

        // Login data

        emailOrPhone: loginForm.emailOrPhone,

        password: loginForm.password,
      };

      console.log("Sending existing user appointment data:", appointmentData);

      const response = await fetch("/api/public/appointment/existing", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Appointment booked successfully!");

        // Reset forms

        setBookingForm({
          consultationMode: "",

          clinicId: "",

          date: "",

          timeSlot: "",
        });

        setLoginForm({
          emailOrPhone: "",

          password: "",
        });

        setCurrentStep("booking");

        setIsNotRobot(false);
      } else {
        alert("Failed to book appointment: " + result.error);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);

      alert("An error occurred while booking the appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep === "auth") {
      setCurrentStep("booking");
    }
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateForInput = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isDateInPast = (year: number, month: number, day: number) => {
    const today = new Date();
    const dateToCheck = new Date(year, month, day);
    today.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const isSelectedDate = (year: number, month: number, day: number) => {
    if (!bookingForm.date) return false;
    const selectedDate = new Date(bookingForm.date);
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateForInput(year, month, day);
      const isAvailable = isDateAvailable(dateString);
      const isPast = isDateInPast(year, month, day);
      const isSelected = isSelectedDate(year, month, day);
      const isDisabled = isPast || !isAvailable;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isDisabled && handleDateChange(dateString)}
          disabled={isDisabled}
          className={`
            p-2 text-sm font-medium rounded-lg transition-all duration-200
            ${
              isSelected
                ? "bg-blue-600 text-white ring-2 ring-blue-300"
                : isAvailable && !isPast
                  ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                  : isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 cursor-not-allowed"
            }
            ${!isDisabled && !isSelected ? "hover:scale-105" : ""}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(year, month - 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(year, month + 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="p-2 text-xs font-medium text-gray-500 text-center"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">{days}</div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded mr-1"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div>
              <span className="text-gray-600">Unavailable</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render booking summary
  const renderBookingSummary = () => {
    if (currentStep !== "auth") return null;

    const selectedClinic = clinics.find(
      (clinic) => clinic.id === parseInt(bookingForm.clinicId)
    );

    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-medium">{doctorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mode:</span>
            <span className="font-medium capitalize">
              {bookingForm.consultationMode}
            </span>
          </div>
          {bookingForm.consultationMode === "offline" && selectedClinic && (
            <div className="flex justify-between">
              <span className="text-gray-600">Clinic:</span>
              <span className="font-medium text-xs">
                {selectedClinic.name} - {selectedClinic.address}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {new Date(bookingForm.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">
              {availableTimeSlots.find(
                (slot) => `${slot.from}-${slot.to}` === bookingForm.timeSlot
              ) &&
                `${formatTime(availableTimeSlots.find((slot) => `${slot.from}-${slot.to}` === bookingForm.timeSlot)!.from)} - ${formatTime(availableTimeSlots.find((slot) => `${slot.from}-${slot.to}` === bookingForm.timeSlot)!.to)}`}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-blue-200">
            <span className="text-gray-600">Fee:</span>
            <span className="font-bold text-blue-600">
              ₹ {consultation.consultationFees}.00
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Before booked an appointment check the availability
          </h2>

          <div className="space-y-3">
            {times.map((dayAvailability) => (
              <div key={dayAvailability.id} className="flex items-center">
                {dayAvailability.isActive ? (
                  <div className="flex items-center text-green-600">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="font-medium">
                      {dayAvailability.dayOfWeek}
                    </span>
                    <span className="ml-2 text-blue-600 text-sm">(Open)</span>
                    {dayAvailability.times.length > 0 && (
                      <span className="ml-2 text-gray-500 text-sm">
                        {dayAvailability.times
                          .map(
                            (slot) =>
                              `${formatTime(slot.from)}-${formatTime(slot.to)}`
                          )
                          .join(", ")}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <span className="text-red-500 mr-3">✗</span>
                    <span className="font-medium">
                      {dayAvailability.dayOfWeek}
                    </span>
                    <span className="ml-2 text-red-600 text-sm">(Close)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-gray-50 p-8 rounded-lg">
          {/* Header */}
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">📅</span>
            <h2 className="text-2xl font-bold text-gray-900">
              Book Appointment
            </h2>
          </div>

          {/* Back button for auth step */}
          {currentStep === "auth" && (
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
               disabled={isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          )}

          {/* Booking Form */}
          {currentStep === "booking" && (
            <form onSubmit={handleBookingFormSubmit} className="space-y-6">
              {/* Consultation Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Mode <span className="text-red-500">*</span>
                </label>
                <select
                  value={bookingForm.consultationMode}
                  onChange={(e) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      consultationMode: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Mode</option>
                  <option value="offline">Offline (In-person)</option>
                  {consultation.isLiveConsultationEnabled && (
                    <option value="online">Online (Video Call)</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Clinic <span className="text-red-500">*</span>
                </label>
                <select
                  value={bookingForm.clinicId}
                  onChange={(e) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      clinicId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select Clinic</option>
                  {clinics
                    .filter((clinic) => clinic.active)
                    .map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name} - {clinic.address}
                      </option>
                    ))}
                </select>
              </div>
              {/* Custom Date Picker */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
                >
                  <span
                    className={
                      bookingForm.date ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {bookingForm.date
                      ? new Date(bookingForm.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select a date"}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${showDatePicker ? "rotate-90" : ""}`}
                  />
                </button>

                {showDatePicker && renderCalendar()}

                {bookingForm.date && !isDateAvailable(bookingForm.date) && (
                  <p className="text-red-500 text-sm mt-1">
                    Doctor is not available on this day. Please select from
                    available days.
                  </p>
                )}
              </div>

              {/* Time Slot */}
              {bookingForm.date &&
                isDateAvailable(bookingForm.date) &&
                availableTimeSlots.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {availableTimeSlots.map((slot, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="radio"
                            name="timeSlot"
                            value={`${slot.from}-${slot.to}`}
                            checked={
                              bookingForm.timeSlot === `${slot.from}-${slot.to}`
                            }
                            onChange={(e) =>
                              setBookingForm((prev) => ({
                                ...prev,
                                timeSlot: e.target.value,
                              }))
                            }
                            className="mr-3"
                          />
                          <span className="text-gray-700">
                            {formatTime(slot.from)} - {formatTime(slot.to)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              {/* Consultation Fee */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">
                    Consultation Fee:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ₹ {consultation.consultationFees}.00
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={
                  !bookingForm.consultationMode ||
                  !bookingForm.date ||
                  !bookingForm.timeSlot ||
                  !isDateAvailable(bookingForm.date) ||
                  !bookingForm.clinicId
                }
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </form>
          )}

          {/* Auth Forms */}
          {currentStep === "auth" && (
            <div>
              {renderBookingSummary()}

              {/* Tabs */}
              <div className="flex mb-6 border-b">
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "register"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  👤 New Registration
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`px-4 py-2 font-medium ${
                    activeTab === "login"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Already have account?
                </button>
              </div>

              {/* Registration Form */}
              {activeTab === "register" && (
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={registrationForm.name}
                      onChange={(e) =>
                        setRegistrationForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={registrationForm.email}
                      onChange={(e) =>
                        setRegistrationForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={registrationForm.phone}
                      onChange={(e) =>
                        setRegistrationForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={registrationForm.password}
                      onChange={(e) =>
                        setRegistrationForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Create a password"
                    />
                  </div>

                  {/* reCAPTCHA placeholder */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notRobot"
                      checked={isNotRobot}
                      onChange={(e) => setIsNotRobot(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="notRobot" className="text-sm text-gray-700">
                      I'm not a robot
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    📅 Book Appointment
                  </button>
                </form>
              )}

              {/* Login Form */}
              {activeTab === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username (Email or Mobile){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={loginForm.emailOrPhone}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          emailOrPhone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email or mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                    />
                  </div>

                  {/* reCAPTCHA placeholder */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notRobotLogin"
                      checked={isNotRobot}
                      onChange={(e) => setIsNotRobot(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="notRobotLogin"
                      className="text-sm text-gray-700"
                    >
                      I'm not a robot
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    📅 Book Appointment
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close date picker */}
      {showDatePicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}
