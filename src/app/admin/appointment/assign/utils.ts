// ./utils/interfaces.ts
export interface TimeSlot {
  id?: number;
  from: string;
  to: string;
}

export interface DaySchedule {
  active: boolean;
  times: TimeSlot[];
}

export interface ScheduleState {
  [key: string]: DaySchedule;
}

export interface OpenDropdownState {
  day: string;
  index: number;
  field: "from" | "to";
}

export interface TimeInputProps {
  value: string;
  onClick: () => void;
  placeholder?: string;
  readOnly?: boolean;
  hasError?: boolean;
}

export interface TimeDropdownProps {
  timeOptions: string[];
  selectedTime: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export interface DayConfig {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  isActive: boolean;
  times?: TimeSlot[];
}
export interface ExistingSetting {
  intervalMinutes: number;
  id: number;
}

export const generateTimeOptions = (interval: number = 10): string[] => {
  if (interval <= 0) return [];

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

export const isTimeRangeValid = (from: string, to: string): boolean => {
  if (!from || !to) return false;

  // Parse times for comparison
  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");

    /* eslint-disable prefer-const */
    let [hours, minutes] = time.split(":").map(Number);
    /* eslint-enable prefer-const */

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  return parseTime(from) < parseTime(to);
};
