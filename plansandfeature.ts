import { plans, planFeatures } from "./src/db/schema";
import { db } from "./src/db/db";

const featuresList = [
  "Services",
  "Blogs",
  "Custom Domain",
  "Online Consultation",
  "Patients",
  "Advise",
  "Diagnosis",
  "Prescription",
  "Appointments",
  "Profile page",
];

async function seed() {
  const planData = [
    {
      name: "BASIC",
      monthlyPrice: 3990,
      yearlyPrice: 43890,
      staffLimit: 2,
      chamberLimit: 1,
      features: [true, false, false, false, true, false, false, true, true, true],
    },
    {
      name: "CLASSIC",
      monthlyPrice: 5490,
      yearlyPrice: 60390,
      staffLimit: 4,
      chamberLimit: 2,
      features: [true, false, false, false, true, false, false, true, true, true],
    },
    {
      name: "PREMIUM",
      monthlyPrice: 8990,
      yearlyPrice: 98890,
      staffLimit: 6,
      chamberLimit: 3,
      features: [true, true, true, true, true, true, true, true, true, true],
    },
  ];

  for (const plan of planData) {
    const inserted = await db.insert(plans).values({
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      staffLimit: plan.staffLimit,
      chamberLimit: plan.chamberLimit,
      isActive: true,
    }).returning();

    const planId = inserted[0].id;

    const featureRecords = featuresList.map((feature, idx) => ({
      planId,
      featureName: feature,
      enabled: plan.features[idx],
    }));

    await db.insert(planFeatures).values(featureRecords);
  }

  console.log("Seed completed.");
}

seed().catch(console.error);
