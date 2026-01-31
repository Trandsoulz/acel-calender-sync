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
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view"); // "month" for calendar view

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

    // For month view, get all events for the current month
    let dateFilter = {};
    if (view === "month") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      dateFilter = {
        startTime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      };
    } else {
      // Default: only future events
      dateFilter = {
        startTime: { gte: new Date() },
      };
    }

    // Fetch events separately
    const events = await prisma.event.findMany({
      where: {
        calendarId: calendar.id,
        status: { not: "cancelled" },
        ...dateFilter,
      },
      orderBy: { startTime: "asc" },
      take: view === "month" ? 100 : 10, // More events for month view
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
