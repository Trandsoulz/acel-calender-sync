import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getTokensFromCode,
  createHotrCalendar,
  syncAllEventsForSubscriber,
} from "@/lib/google";
import { matchesEventTargeting } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle user denying access
  if (error) {
    return NextResponse.redirect(
      new URL("/subscribe?error=google_denied", request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/subscribe?error=missing_params", request.url)
    );
  }

  try {
    // Decode state to get subscriber info
    const stateData = JSON.parse(Buffer.from(state, "base64").toString());
    const { subscriberId, calendarSlug } = stateData;
    
    console.log("OAuth callback - subscriberId:", subscriberId, "calendarSlug:", calendarSlug);

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);
    console.log("Got tokens:", !!tokens.access_token, !!tokens.refresh_token);

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    // Create HOTR calendar in user's Google Calendar
    console.log("Creating HOTR calendar...");
    const googleCalendarId = await createHotrCalendar(
      tokens.access_token,
      tokens.refresh_token || null
    );
    console.log("Created calendar:", googleCalendarId);

    // Update subscriber with Google tokens
    console.log("Updating subscriber...");
    const subscriber = await prisma.subscriber.update({
      where: { id: subscriberId },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || null,
        googleTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
        googleCalendarId,
        platform: "google",
      },
      include: {
        calendar: {
          include: {
            events: true,
          },
        },
      },
    });

    // Filter events based on subscriber demographics
    const relevantEvents = subscriber.calendar.events.filter((event) =>
      matchesEventTargeting(
        {
          gender: subscriber.gender,
          country: subscriber.country,
          relationshipStatus: subscriber.relationshipStatus,
          dob: subscriber.dob,
        },
        event
      )
    );

    // Sync all relevant events to Google Calendar
    if (relevantEvents.length > 0) {
      await syncAllEventsForSubscriber(
        tokens.access_token,
        tokens.refresh_token || null,
        googleCalendarId,
        relevantEvents
      );
    }

    // Redirect to success page
    const successUrl = new URL("/subscribe/success", request.url);
    successUrl.searchParams.set("google", "true");
    successUrl.searchParams.set("name", subscriber.name.split(" ")[0]);
    successUrl.searchParams.set("events", relevantEvents.length.toString());

    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/subscribe?error=google_auth_failed", request.url)
    );
  }
}
