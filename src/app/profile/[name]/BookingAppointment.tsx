// components/BookingAppointment.tsx
import { useState } from "react";

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

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={getMinDate()}
                value={bookingForm.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
    </div>
  );
}