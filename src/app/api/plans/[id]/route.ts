// app/api/plans/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { plans, planFeatures } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../../db/db";

interface Feature {
  featureName: string;
  enabled: boolean;
}

interface PlanUpdateData {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  staffLimit: number;
  chamberLimit: number;
  isActive: boolean;
  features: Feature[];
}

// PUT handler for updating a plan
export async function PUT(
  request: NextRequest,
) {
  // Extract ID from the URL path
  const id = request.nextUrl.pathname.split('/').pop();
  const planId = parseInt(id || '', 10);

  if (isNaN(planId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid plan ID",
      },
      { status: 400 }
    );
  }

  try {
    const data = (await request.json()) as PlanUpdateData;

    // Update plan
    await db
      .update(plans)
      .set({
        name: data.name,
        monthlyPrice: data.monthlyPrice,
        yearlyPrice: data.yearlyPrice,
        staffLimit: data.staffLimit,
        chamberLimit: data.chamberLimit,
        isActive: data.isActive,
      })
      .where(eq(plans.id, planId));

    // Get existing features for this plan
    const existingFeatures = await db
      .select()
      .from(planFeatures)
      .where(eq(planFeatures.planId, planId));

    // Update existing features
    // We'll use a transaction to ensure all updates are atomic
    await db.transaction(async (tx) => {
      // Update each feature
      for (const feature of data.features) {
        const existingFeature = existingFeatures.find(
          (f) => f.featureName === feature.featureName
        );

        if (existingFeature) {
          // Update existing feature
          await tx
            .update(planFeatures)
            .set({ enabled: feature.enabled })
            .where(eq(planFeatures.id, existingFeature.id));
        } else {
          // Create new feature
          await tx.insert(planFeatures).values({
            planId: planId,
            featureName: feature.featureName,
            enabled: feature.enabled,
          });
        }
      }
    });

    // Fetch the updated plan with features
    const updatedPlan = await db
      .select()
      .from(plans)
      .where(eq(plans.id, planId))
      .then((res) => res[0]);
    const updatedFeatures = await db
      .select()
      .from(planFeatures)
      .where(eq(planFeatures.planId, planId));

    return NextResponse.json(
      {
        success: true,
        data: {
          ...updatedPlan,
          features: updatedFeatures,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update plan",
      },
      { status: 500 }
    );
  }
}

// PATCH handler for updating plan status
export async function PATCH(
  request: NextRequest,
) {
  // Extract ID from the URL path
  const id = request.nextUrl.pathname.split('/').pop();
  const planId = parseInt(id || '', 10);

  if (isNaN(planId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid plan ID",
      },
      { status: 400 }
    );
  }

  try {
    const { isActive } = await request.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body. Expected { isActive: boolean }",
        },
        { status: 400 }
      );
    }

    // Update plan's active status
    await db.update(plans).set({ isActive }).where(eq(plans.id, planId));

    return NextResponse.json(
      {
        success: true,
        data: { id: planId, isActive },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating plan status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update plan status",
      },
      { status: 500 }
    );
  }
}