import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  TimeSlot,
  ClinicData,
  AvailabilityData,
  ConsultationData,
  BookingFormData,
} from "./doctor";
import ReCAPTCHA from "react-google-recaptcha";

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

// Add validation types
type ValidationError = {
  field: string;
  message: string;
};

type FormErrors = {
  booking?: ValidationError[];
  registration?: ValidationError[];
  login?: ValidationError[];
};

// Add validation utilities
const validateBookingForm = (form: BookingFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!form.consultationMode) {
    errors.push({
      field: "consultationMode",
      message: "Please select a consultation mode",
    });
  }
  if (!form.date) {
    errors.push({ field: "date", message: "Please select a date" });
  }
  if (!form.timeSlot) {
    errors.push({ field: "timeSlot", message: "Please select a time slot" });
  }
  if (form.consultationMode === "offline" && !form.clinicId) {
    errors.push({ field: "clinicId", message: "Please select a clinic" });
  }

  return errors;
};

const validateRegistrationForm = (
  form: RegistrationFormData
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!form.name?.trim()) {
    errors.push({ field: "name", message: "Name is required" });
  }
  if (!form.phone?.trim()) {
    errors.push({ field: "phone", message: "Phone number is required" });
  } else if (!/^[0-9]{10}$/.test(form.phone)) {
    errors.push({
      field: "phone",
      message: "Please enter a valid 10-digit phone number",
    });
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address",
    });
  }
  if (!form.password?.trim()) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (form.password.length < 6) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 characters",
    });
  }

  return errors;
};

const validateLoginForm = (form: LoginFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!form.emailOrPhone?.trim()) {
    errors.push({
      field: "emailOrPhone",
      message: "Email or phone number is required",
    });
  }
  if (!form.password?.trim()) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
};

// Add a reusable Input component
const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = "",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      placeholder={placeholder}
      disabled={disabled}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Add a reusable Select component
const Select = ({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  disabled = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      disabled={disabled}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Add loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
  </div>
);

// Add a reusable Button component
const Button = ({
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  children,
}: {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? <LoadingSpinner /> : children}
  </button>
);

// Add types for popup components
type PopupProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

// Add success popup component
const SuccessPopup = ({ message, onClose }: Omit<PopupProps, "isOpen">) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl animate-slideIn">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Success</h3>
      </div>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex justify-end">
        <Button onClick={onClose}>OK</Button>
      </div>
    </div>
  </div>
);

// Add error popup component
const ErrorPopup = ({ isOpen, message, onClose }: PopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl animate-slideIn">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Error</h3>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <Button onClick={onClose}>OK</Button>
        </div>
      </div>
    </div>
  );
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
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

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

    const errors = validateBookingForm(bookingForm);
    if (errors.length > 0) {
      setFormErrors({ booking: errors });
      setErrorMessage(errors[0].message);
      setShowErrorPopup(true);
      return;
    }

    setCurrentStep("auth");
  };

  // Show error popup

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  // Close error popup

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorMessage("");
  };

  // Redirect to patient appointments page

  const redirectToAppointments = () => {
    window.location.href = "/patient/appointments";
  };

  // Handle registration form submission
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateRegistrationForm(registrationForm);
    if (errors.length > 0) {
      setFormErrors({ registration: errors });
      setErrorMessage(errors[0].message);
      setShowErrorPopup(true);
      return;
    }

    if (!isNotRobot) {
      setErrorMessage("Please verify that you are not a robot");
      setShowErrorPopup(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const appointmentData = {
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        consultationMode: bookingForm.consultationMode,
        doctorId: doctorId,
        clinicId: bookingForm.clinicId,
        consultationFees: consultation.consultationFees,
        name: registrationForm.name,
        email: registrationForm.email,
        phone: registrationForm.phone,
        password: registrationForm.password,
      };

      const response = await fetch("/api/public/appointment/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
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

        // Show success message
        setSuccessMessage(
          "Appointment booked successfully! Redirecting to appointments page..."
        );
        setShowSuccessPopup(true);

        // Redirect after a short delay
        setTimeout(() => {
          redirectToAppointments();
        }, 2000);
      } else {
        setErrorMessage(result.error || "Failed to book appointment");
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrorMessage(
        "An error occurred while booking the appointment. Please try again."
      );
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateLoginForm(loginForm);
    if (errors.length > 0) {
      setFormErrors({ login: errors });
      setErrorMessage(errors[0].message);
      setShowErrorPopup(true);
      return;
    }

    if (!isNotRobot) {
      setErrorMessage("Please verify that you are not a robot");
      setShowErrorPopup(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const appointmentData = {
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        consultationMode: bookingForm.consultationMode,
        doctorId: doctorId,
        clinicId: bookingForm.clinicId,
        consultationFees: consultation.consultationFees,
        emailOrPhone: loginForm.emailOrPhone,
        password: loginForm.password,
      };

      const response = await fetch("/api/public/appointment/existing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
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

        // Show success message
        setSuccessMessage(
          "Appointment booked successfully! Redirecting to appointments page..."
        );
        setShowSuccessPopup(true);

        // Redirect after a short delay
        setTimeout(() => {
          redirectToAppointments();
        }, 2000);
      } else {
        setErrorMessage(result.error || "Failed to book appointment");
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrorMessage(
        "An error occurred while booking the appointment. Please try again."
      );
      setShowErrorPopup(true);
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
              <Select
                label="Consultation Mode"
                value={bookingForm.consultationMode}
                onChange={(e) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    consultationMode: e.target.value,
                  }))
                }
                options={[
                  { value: "offline", label: "Offline (In-person)" },
                  ...(consultation.isLiveConsultationEnabled
                    ? [{ value: "online", label: "Online (Video Call)" }]
                    : []),
                ]}
                required
                error={
                  formErrors.booking?.find(
                    (e) => e.field === "consultationMode"
                  )?.message
                }
              />

              {/* Show clinic selection for both online and offline consultations */}
              {bookingForm.consultationMode && (
                <Select
                  label="Select Clinic"
                  value={bookingForm.clinicId}
                  onChange={(e) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      clinicId: e.target.value,
                    }))
                  }
                  options={clinics
                    .filter((clinic) => clinic.active)
                    .map((clinic) => ({
                      value: clinic.id.toString(),
                      label: `${clinic.name} - ${clinic.address}`,
                    }))}
                  required
                  error={
                    formErrors.booking?.find((e) => e.field === "clinicId")
                      ?.message
                  }
                />
              )}

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
              <Button
                type="submit"
                disabled={
                  !bookingForm.consultationMode ||
                  !bookingForm.date ||
                  !bookingForm.timeSlot ||
                  !isDateAvailable(bookingForm.date) ||
                  (bookingForm.consultationMode === "offline" &&
                    !bookingForm.clinicId)
                }
              >
                Continue →
              </Button>
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  Already have account?
                </button>
              </div>

              {/* Registration Form */}
              {activeTab === "register" && (
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    value={registrationForm.name}
                    onChange={(e) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    required
                    error={
                      formErrors.registration?.find((e) => e.field === "name")
                        ?.message
                    }
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter your email"
                    error={
                      formErrors.registration?.find((e) => e.field === "email")
                        ?.message
                    }
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Phone"
                    type="tel"
                    value={registrationForm.phone}
                    onChange={(e) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Enter your phone number"
                    required
                    error={
                      formErrors.registration?.find((e) => e.field === "phone")
                        ?.message
                    }
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={registrationForm.password}
                    onChange={(e) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Create a password"
                    required
                    error={
                      formErrors.registration?.find(
                        (e) => e.field === "password"
                      )?.message
                    }
                    disabled={isSubmitting}
                  />

                  {/* reCAPTCHA placeholder */}
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={(token) => setRecaptchaToken(token)}
                    theme="light" // or "dark"
                    className="mt-4"
                  />

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    📅 Book Appointment
                  </Button>
                </form>
              )}

              {/* Login Form */}
              {activeTab === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <Input
                    label="Username (Email or Mobile)"
                    value={loginForm.emailOrPhone}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        emailOrPhone: e.target.value,
                      }))
                    }
                    placeholder="Enter email or mobile number"
                    required
                    error={
                      formErrors.login?.find((e) => e.field === "emailOrPhone")
                        ?.message
                    }
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter your password"
                    required
                    error={
                      formErrors.login?.find((e) => e.field === "password")
                        ?.message
                    }
                    disabled={isSubmitting}
                  />

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

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    📅 Book Appointment
                  </Button>
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

      {/* Add popups */}
      <ErrorPopup
        isOpen={showErrorPopup}
        message={errorMessage}
        onClose={closeErrorPopup}
      />
      {showSuccessPopup && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}
