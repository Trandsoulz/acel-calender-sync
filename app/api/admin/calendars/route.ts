import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

// GET all calendars (admin)
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const calendars = await prisma.calendar.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            events: true,
            subscribers: true,
          },
        },
      },
    });

    return NextResponse.json({ calendars });
  } catch (error) {
    console.error("Calendars fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendars" },
      { status: 500 }
    );
  }
}

// POST create new calendar
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, isPublic = true } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);

    // Check if slug exists and make unique if needed
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.calendar.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const calendar = await prisma.calendar.create({
      data: {
        name,
        slug,
        description: description || null,
        isPublic,
      },
    });

    return NextResponse.json({ calendar }, { status: 201 });
  } catch (error) {
    console.error("Calendar create error:", error);
    return NextResponse.json(
      { error: "Failed to create calendar" },
      { status: 500 }
    );
  }
}
