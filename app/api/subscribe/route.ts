import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateFeedToken } from "@/lib/utils";
import { generateSubscriptionUrls } from "@/lib/ics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      gender,
      country,
      relationshipStatus,
      dob,
      platform,
      interests,
      calendarSlug,
    } = body;

    // Validate required fields
    if (!name || !email || !gender || !country || !relationshipStatus || !dob) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the calendar
    const calendar = await prisma.calendar.findUnique({
      where: { slug: calendarSlug || "hotr-port-harcourt" },
    });

    if (!calendar) {
      return NextResponse.json(
        { error: "Calendar not found" },
        { status: 404 }
      );
    }

    // Check if subscriber already exists for this calendar
    const existingSubscriber = await prisma.subscriber.findFirst({
      where: {
        email,
        calendarId: calendar.id,
      },
    });

    if (existingSubscriber) {
      // Return existing subscription URLs
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
      const urls = generateSubscriptionUrls(baseUrl, calendar.slug, existingSubscriber.feedToken);

      return NextResponse.json({
        success: true,
        message: "You are already subscribed!",
        subscriber: {
          id: existingSubscriber.id,
          name: existingSubscriber.name,
          feedToken: existingSubscriber.feedToken,
        },
        urls,
        calendar: {
          name: calendar.name,
          slug: calendar.slug,
        },
      });
    }

    // Create new subscriber
    const feedToken = generateFeedToken();
    
    const subscriber = await prisma.subscriber.create({
      data: {
        name,
        email,
        phone: phone || null,
        gender,
        country,
        relationshipStatus,
        dob: new Date(dob),
        feedToken,
        platform: platform || null,
        interests: interests || [],
        calendarId: calendar.id,
      },
    });

    // Generate subscription URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const urls = generateSubscriptionUrls(baseUrl, calendar.slug, subscriber.feedToken);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
      subscriber: {
        id: subscriber.id,
        name: subscriber.name,
        feedToken: subscriber.feedToken,
      },
      urls,
      calendar: {
        name: calendar.name,
        slug: calendar.slug,
      },
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
