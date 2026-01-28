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
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isPublic: true,
        createdAt: true,
        _count: {
          select: {
            events: true,
            subscribers: true,
          },
        },
      },
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

    return NextResponse.json({
      id: calendar.id,
      name: calendar.name,
      slug: calendar.slug,
      description: calendar.description,
      eventCount: calendar._count.events,
      subscriberCount: calendar._count.subscribers,
      createdAt: calendar.createdAt,
    });
  } catch (error) {
    console.error("Calendar fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
