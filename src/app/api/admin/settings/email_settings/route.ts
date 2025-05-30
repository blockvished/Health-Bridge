// api/admin/settings/email_settings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db/db"; // Adjust import path to your database connection
import { emailConfig } from "../../../../../db/schema"; // Adjust import path to your schema
import { eq } from "drizzle-orm";

// GET - Retrieve current email settings
export async function GET() {
  try {
    const settings = await db
      .select()
      .from(emailConfig)
      .where(eq(emailConfig.singletonId, "singleton"))
      .limit(1);

    if (settings.length === 0) {
      return NextResponse.json(
        { success: false, message: "No email configuration found" },
        { status: 404 }
      );
    }

    // Remove password from response for security
    // const { mailPassword, ...safeSettings } = settings[0];

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching email settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch email settings" },
      { status: 500 }
    );
  }
}

// POST/PUT - Create or update email settings (upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      mailType,
      mailTitle,
      mailHost,
      mailPort,
      mailUsername,
      mailPassword,
      mailEncryption,
    } = body;

    if (!mailType || !mailTitle || !mailHost || !mailPort) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: mailType, mailTitle, mailHost, mailPort",
        },
        { status: 400 }
      );
    }

    // Validate mail type
    if (!["smtp", "pop3", "imap"].includes(mailType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Mail type must be smtp, pop3, or imap",
        },
        { status: 400 }
      );
    }

    // Validate port is a number
    const portNumber =
      typeof mailPort === "number" ? mailPort : parseInt(mailPort);
    if (isNaN(portNumber) || portNumber <= 0 || portNumber > 65535) {
      return NextResponse.json(
        {
          success: false,
          message: "Mail port must be a valid number between 1 and 65535",
        },
        { status: 400 }
      );
    }

    // Validate encryption type
    if (
      mailEncryption &&
      !["SSL", "TLS", "STARTTLS", ""].includes(mailEncryption)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Mail encryption must be SSL, TLS, STARTTLS, or empty for no encryption",
        },
        { status: 400 }
      );
    }

    // Check if configuration already exists
    const existingConfig = await db
      .select()
      .from(emailConfig)
      .where(eq(emailConfig.singletonId, "singleton"))
      .limit(1);

    const now = new Date();
    const configData = {
      singletonId: "singleton" as const,
      mailType,
      mailTitle,
      mailHost,
      mailPort: portNumber,
      mailUsername: mailUsername || null,
      mailEncryption: mailEncryption || null,
      isActive: true,
      updatedAt: now,
    };

    let result;

    if (existingConfig.length > 0) {
      // For updates, only include password if it's provided
      const updateData = mailPassword
        ? { ...configData, mailPassword }
        : configData;

      result = await db
        .update(emailConfig)
        .set(updateData)
        .where(eq(emailConfig.singletonId, "singleton"))
        .returning();
    } else {
      // Create new configuration
      result = await db
        .insert(emailConfig)
        .values({
          ...configData,
          mailPassword: mailPassword || null,
          createdAt: now,
        })
        .returning();
    }

    // Remove password from response
    const { mailPassword: removedPassword, ...safeResult } = result[0];
    // Explicitly use the removed password variable to avoid linting error
    void removedPassword;

    return NextResponse.json({
      success: true,
      message:
        existingConfig.length > 0
          ? "Email settings updated successfully"
          : "Email settings created successfully",
      data: safeResult,
    });
  } catch (error) {
    console.error("Error saving email settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save email settings" },
      { status: 500 }
    );
  }
}

// PUT - Alternative endpoint for updates (same as POST due to upsert pattern)
export async function PUT(request: NextRequest) {
  return POST(request);
}

// DELETE - Deactivate email settings
export async function DELETE() {
  try {
    const result = await db
      .update(emailConfig)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(emailConfig.singletonId, "singleton"))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No email configuration found to deactivate",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email settings deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating email settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to deactivate email settings" },
      { status: 500 }
    );
  }
}
