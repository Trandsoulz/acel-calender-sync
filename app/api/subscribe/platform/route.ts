import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH - Update subscriber's platform preference
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriberId, platform } = body;

    if (!subscriberId || !platform) {
      return NextResponse.json(
        { error: "Missing subscriberId or platform" },
        { status: 400 }
      );
    }

    // Validate platform
    const validPlatforms = ["google", "apple", "outlook", "other"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }

    // Update the subscriber's platform
    const subscriber = await prisma.subscriber.update({
      where: { id: subscriberId },
      data: { platform },
    });

    return NextResponse.json({
      success: true,
      platform: subscriber.platform,
    });
  } catch (error) {
    console.error("Platform update error:", error);
    return NextResponse.json(
      { error: "Failed to update platform" },
      { status: 500 }
    );
  }
}
