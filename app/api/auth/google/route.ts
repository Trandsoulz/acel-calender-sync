import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const subscriberId = searchParams.get("subscriberId");
  const calendarSlug = searchParams.get("calendarSlug");

  if (!subscriberId) {
    return NextResponse.json(
      { error: "Subscriber ID is required" },
      { status: 400 }
    );
  }

  // Encode subscriber info in state parameter
  const state = Buffer.from(
    JSON.stringify({
      subscriberId,
      calendarSlug: calendarSlug || "hotr-port-harcourt",
    })
  ).toString("base64");

  const authUrl = getGoogleAuthUrl(state);

  return NextResponse.redirect(authUrl);
}
