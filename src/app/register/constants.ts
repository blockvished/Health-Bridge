export const specialities = [
  "Dentist",
  "General Practitioner",
  "Pediatrician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Psychiatrist",
  "Gynecologist",
  "Other",
];

export const practiceTypes = [
  "Solo Practice",
  "Group Practice",
  "Clinic Chain",
  "Hospital",
  "Other",
];

export type PlanFeature = {
  id: number;
  planId: number;
  featureName: string;
  enabled: boolean;
};

export type Plan = {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  staffLimit: number;
  chamberLimit: number;
  isActive: boolean;
  features: PlanFeature[];
};