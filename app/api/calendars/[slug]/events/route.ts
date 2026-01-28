import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const calendar = await prisma.calendar.findUnique({
      where: { slug },
    });

    if (!calendar) {
      return NextResponse.json(
        { error: "Calendar not found" },
        { status: 404 }
      );
    }

    if (!calendar.isPublic) {
      return NextResponse.json(
        { error: "Calendar is private" },
        { status: 403 }
      );
    }

    // Fetch events separately
    const events = await prisma.event.findMany({
      where: {
        calendarId: calendar.id,
        status: { not: "cancelled" },
        startTime: { gte: new Date() }, // Only future events
      },
      orderBy: { startTime: "asc" },
      take: 10, // Limit for public view
      select: {
        id: true,
        title: true,
        description: true,
        startTime: true,
        endTime: true,
        timezone: true,
        location: true,
        status: true,
        // Don't expose targeting info publicly
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
