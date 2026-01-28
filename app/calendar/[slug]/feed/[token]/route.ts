import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateIcsContent } from "@/lib/ics";
import { matchesEventTargeting } from "@/lib/utils";

interface RouteParams {
  params: Promise<{
    slug: string;
    token: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug, token } = await params;
    
    // Remove .ics extension if present
    const feedToken = token.replace(/\.ics$/, "");

    // Find the calendar with events
    const calendar = await prisma.calendar.findUnique({
      where: { slug },
    });

    if (!calendar) {
      return new NextResponse("Calendar not found", { status: 404 });
    }

    // Fetch events separately
    const events = await prisma.event.findMany({
      where: {
        calendarId: calendar.id,
        status: { not: "cancelled" },
      },
      orderBy: { startTime: "asc" },
    });

    // Find the subscriber
    const subscriber = await prisma.subscriber.findUnique({
      where: { feedToken },
    });

    if (!subscriber) {
      return new NextResponse("Invalid feed token", { status: 401 });
    }

    // Verify subscriber belongs to this calendar
    if (subscriber.calendarId !== calendar.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Filter events based on subscriber demographics
    const filteredEvents = events.filter((event) =>
      matchesEventTargeting(
        {
          gender: subscriber.gender,
          country: subscriber.country,
          relationshipStatus: subscriber.relationshipStatus,
          dob: subscriber.dob,
        },
        {
          targetGenders: event.targetGenders,
          targetAgeMin: event.targetAgeMin,
          targetAgeMax: event.targetAgeMax,
          targetCountries: event.targetCountries,
          targetRelationshipStatuses: event.targetRelationshipStatuses,
        }
      )
    );

    // Generate ICS content
    const icsContent = await generateIcsContent({
      calendarName: calendar.name,
      events: filteredEvents,
    });

    // Return ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${calendar.slug}.ics"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("ICS feed error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
