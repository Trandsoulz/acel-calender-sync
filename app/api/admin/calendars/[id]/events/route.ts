import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { generateEventUid } from "@/lib/utils";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET all events for a calendar
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const events = await prisma.event.findMany({
      where: { calendarId: id },
      orderBy: { startTime: "asc" },
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

// POST create new event
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: calendarId } = await params;
    const body = await request.json();

    const {
      title,
      description,
      startTime,
      endTime,
      timezone = "Africa/Lagos",
      location,
      status = "confirmed",
      targetGenders = [],
      targetAgeMin,
      targetAgeMax,
      targetCountries = [],
      targetRelationshipStatuses = [],
    } = body;

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Title, start time, and end time are required" },
        { status: 400 }
      );
    }

    // Verify calendar exists
    const calendar = await prisma.calendar.findUnique({
      where: { id: calendarId },
    });

    if (!calendar) {
      return NextResponse.json(
        { error: "Calendar not found" },
        { status: 404 }
      );
    }

    // Create event with temporary UID, then update with proper UID
    const event = await prisma.event.create({
      data: {
        uid: "temp", // Will be updated
        title,
        description: description || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        timezone,
        location: location || null,
        status,
        targetGenders,
        targetAgeMin: targetAgeMin ?? null,
        targetAgeMax: targetAgeMax ?? null,
        targetCountries,
        targetRelationshipStatuses,
        calendarId,
      },
    });

    // Update with proper UID
    const updatedEvent = await prisma.event.update({
      where: { id: event.id },
      data: { uid: generateEventUid(event.id) },
    });

    return NextResponse.json({ event: updatedEvent }, { status: 201 });
  } catch (error) {
    console.error("Event create error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
