import { plans, planFeatures } from "./src/db/schema";
import { db } from "./src/db/db";

const basicFeaturesList = [
  "Online Appointment Booking",
  "Patient Follow-Up Messages",
  "WhatsApp & SMS Reminders",
  "Clinic Staff Accounts",
  "Social Media Automation",
  "ePrescription (Digital Prescription)",
  "Track Patients & Growth Metrics",
  "Access to Doctor's App",
  "Teleconsultation (100/month)",
  "Basic Mail & Chat Support",
];

const professionalFeaturesList = [
  "Everything in Basic",
  "HD Teleconsultation",
  "Unlimited ePrescriptions",
  "Clinic Staff Accounts (6)",
  "Advanced Marketing Tools",
  "Google Business Listing",
  "Campaign Tracking Dashboard",
  "Advanced Dashboard Analytics",
  "Advanced Rating & Reviews",
  "Dedicated 24/7 Live Support",
];

const premiumFeaturesList = [
  "Everything in Professional",
  "Unlimited HD Video Consults",
  "WhatsApp Campaign Blasts",
  "Staff & Branch Control",
  "Location & Staff Wise Report",
  "Custom Domain* Setup",
  "Advanced Branding Tools",
  "Monthly YouTube Video",
  "Monthly Interview Podcast",
  "Dedicated Success Manager",
  "Priority Phone + WhatsApp Support",
];

async function seed() {
  const planData = [
    {
      name: "BASIC",
      monthlyPrice: 4999,
      yearlyPrice: 59988,
      staffLimit: 3,
      chamberLimit: 1,
      features: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      featureList: basicFeaturesList,

    },
    {
      name: "PROFESSIONAL",
      monthlyPrice: 7999,
      yearlyPrice: 95988,
      staffLimit: 6,
      chamberLimit: 2,
      features: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      featureList: professionalFeaturesList,
    },
    {
      name: "PREMIUM",
      monthlyPrice: 8990,
      yearlyPrice: 107880,
      staffLimit: 100,
      chamberLimit: 3,
      features: [true, true, true, true, true, true, true, true, true, true],
      featureList: premiumFeaturesList,
    },
  ];

  for (const plan of planData) {
    const inserted = await db
      .insert(plans)
      .values({
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        staffLimit: plan.staffLimit,
        chamberLimit: plan.chamberLimit,
        isActive: true,
      })
      .returning();

    const planId = inserted[0].id;

    const featureRecords = plan.featureList.map((featureName, index) => ({
      planId,
      featureName: featureName,
      enabled: plan.features[index] === true || typeof plan.features[index] === 'string',
    })).filter(record => record.enabled);

    await db.insert(planFeatures).values(featureRecords);
  }
  const insertedNoPlan = await db
  .insert(plans)
  .values({
    id: 0,
    name: "No plan",
    monthlyPrice: 0,
    yearlyPrice: 0,
    staffLimit: 0,
    chamberLimit: 0,
    isActive: false,
  })
  .returning();

  console.log("Seed completed.");
}

seed().catch(console.error);
