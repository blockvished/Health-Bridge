import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TimeSlot = {
  from: string;
  to: string;
};

type AvailabilityData = {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  isActive: boolean;
  times: TimeSlot[];
};

type ConsultationData = {
  id: number;
  doctorId: number;
  consultationFees: number;
  consultationLink: string;
  isLiveConsultationEnabled: boolean;
  mode: string;
};

type BookingFormData = {
  consultationMode: string;
  date: string;
  timeSlot: string;
};

type BookingAppointmentProps = {
  times: AvailabilityData[];
  consultation: ConsultationData;
  doctorId: number;
  doctorName: string;
};

export default function BookingAppointment({
  times,
  consultation,
  doctorId,
  doctorName,
}: BookingAppointmentProps) {
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    consultationMode: "",
    date: "",
    timeSlot: "",
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      const dayAvailability = times.find(
        (day) => day.dayOfWeek === dayName
      );

      if (dayAvailability && dayAvailability.isActive) {
        setAvailableTimeSlots(dayAvailability.times);
      } else {
        setAvailableTimeSlots([]);
      }
    } else {
      setAvailableTimeSlots([]);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !bookingForm.consultationMode ||
      !bookingForm.date ||
      !bookingForm.timeSlot
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Console log the booking data
    console.log("Booking Form Data:", {
      ...bookingForm,
      doctorId: doctorId,
      doctorName: doctorName,
      consultationFees: consultation.consultationFees,
      selectedTimeSlot: availableTimeSlots.find(
        (slot) => `${slot.from}-${slot.to}` === bookingForm.timeSlot
      ),
    });
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateForInput = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
    return selectedDate.getFullYear() === year && 
           selectedDate.getMonth() === month && 
           selectedDate.getDate() === day;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
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
            ${isSelected 
              ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
              : isAvailable && !isPast
                ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                : isPast
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-400 cursor-not-allowed'
            }
            ${!isDisabled && !isSelected ? 'hover:scale-105' : ''}
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
          {dayNames.map(dayName => (
            <div key={dayName} className="p-2 text-xs font-medium text-gray-500 text-center">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Availability */}
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

        {/* Right Side - Book Appointment Form */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">📅</span>
            <h2 className="text-2xl font-bold text-gray-900">
              Book Appointment
            </h2>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
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
                <span className={bookingForm.date ? "text-gray-900" : "text-gray-500"}>
                  {bookingForm.date 
                    ? new Date(bookingForm.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })
                    : "Select a date"
                  }
                </span>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showDatePicker ? 'rotate-90' : ''}`} />
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
                !isDateAvailable(bookingForm.date)
              }
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </form>
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