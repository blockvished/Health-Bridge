// types/doctor.ts
export type ConsultationData = {
  id: number;
  doctorId: number;
  consultationFees: number;
  consultationLink: string;
  isLiveConsultationEnabled: boolean;
  mode: string;
};

export type DoctorData = {
  id: number;
  name: string;
  specialization: string;
  degree: string;
  experience: number;
  aboutSelf: string;
  image: string;
};

export type EducationData = {
  id: number;
  doctorId: number;
  title: string;
  institution: string;
  yearFrom: number;
  yearTo: number;
  details: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ExperienceData = {
  id: number;
  doctorId: number;
  title: string;
  organization: string;
  yearFrom: number;
  yearTo: number | null;
  details: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type TimeSlot = {
  from: string;
  to: string;
};

export type AvailabilityData = {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  isActive: boolean;
  times: TimeSlot[];
};

export type ApiResponse = {
  doctor: DoctorData;
  consultation: ConsultationData;
  educations: EducationData[];
  experience: ExperienceData[];
  times: AvailabilityData[];
};

export type BookingFormData = {
  consultationMode: string;
  date: string;
  timeSlot: string;
};

export type PageProps = {
  params: Promise<{
    name: string;
  }>;
};