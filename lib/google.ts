import { google } from "googleapis";

// Google OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
);

// Scopes needed for calendar access
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

/**
 * Generate the Google OAuth URL for user authorization
 */
export function getGoogleAuthUrl(state: string): string {
  return oauth2Client.generateAuthUrl({
    access_type: "offline", // Get refresh token
    scope: SCOPES,
    state, // Pass subscriber data through state
    prompt: "consent", // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Get an authenticated OAuth2 client for a subscriber
 */
export function getAuthenticatedClient(
  accessToken: string,
  refreshToken: string | null
) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
  );

  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return client;
}

/**
 * Create a secondary calendar in the user's Google Calendar account
 */
export async function createHotrCalendar(
  accessToken: string,
  refreshToken: string | null
): Promise<string> {
  const auth = getAuthenticatedClient(accessToken, refreshToken);
  const calendar = google.calendar({ version: "v3", auth });

  // Check if HOTR calendar already exists
  const calendarList = await calendar.calendarList.list();
  const existingCalendar = calendarList.data.items?.find(
    (cal) => cal.summary === "HOTR Port Harcourt"
  );

  if (existingCalendar?.id) {
    return existingCalendar.id;
  }

  // Create new secondary calendar
  const newCalendar = await calendar.calendars.insert({
    requestBody: {
      summary: "HOTR Port Harcourt",
      description: "House on the Rock Port Harcourt - Church Events Calendar",
      timeZone: "Africa/Lagos",
    },
  });

  // Set calendar color to gold-ish
  if (newCalendar.data.id) {
    await calendar.calendarList.patch({
      calendarId: newCalendar.data.id,
      requestBody: {
        backgroundColor: "#D4A853",
        foregroundColor: "#000000",
      },
    });
  }

  return newCalendar.data.id || "";
}

/**
 * Sync an event to a subscriber's Google Calendar
 */
export async function syncEventToGoogleCalendar(
  accessToken: string,
  refreshToken: string | null,
  googleCalendarId: string,
  event: {
    id: string;
    uid: string;
    title: string;
    description: string | null;
    startTime: Date;
    endTime: Date;
    location: string | null;
    status: string;
  }
): Promise<void> {
  const auth = getAuthenticatedClient(accessToken, refreshToken);
  const calendar = google.calendar({ version: "v3", auth });

  const eventData = {
    summary: event.title,
    description: event.description || undefined,
    location: event.location || undefined,
    start: {
      dateTime: event.startTime.toISOString(),
      timeZone: "Africa/Lagos",
    },
    end: {
      dateTime: event.endTime.toISOString(),
      timeZone: "Africa/Lagos",
    },
    status: event.status === "cancelled" ? "cancelled" : "confirmed",
  };

  try {
    // Try to update existing event first
    await calendar.events.update({
      calendarId: googleCalendarId,
      eventId: event.id,
      requestBody: eventData,
    });
  } catch {
    // Event doesn't exist, create it
    await calendar.events.insert({
      calendarId: googleCalendarId,
      requestBody: {
        ...eventData,
        id: event.id,
      },
    });
  }
}

/**
 * Delete an event from a subscriber's Google Calendar
 */
export async function deleteEventFromGoogleCalendar(
  accessToken: string,
  refreshToken: string | null,
  googleCalendarId: string,
  eventId: string
): Promise<void> {
  const auth = getAuthenticatedClient(accessToken, refreshToken);
  const calendar = google.calendar({ version: "v3", auth });

  try {
    await calendar.events.delete({
      calendarId: googleCalendarId,
      eventId: eventId,
    });
  } catch {
    // Event might not exist, ignore error
  }
}

/**
 * Sync all events for a subscriber (used after initial OAuth)
 */
export async function syncAllEventsForSubscriber(
  accessToken: string,
  refreshToken: string | null,
  googleCalendarId: string,
  events: Array<{
    id: string;
    uid: string;
    title: string;
    description: string | null;
    startTime: Date;
    endTime: Date;
    location: string | null;
    status: string;
  }>
): Promise<void> {
  for (const event of events) {
    await syncEventToGoogleCalendar(
      accessToken,
      refreshToken,
      googleCalendarId,
      event
    );
  }
}

/**
 * Refresh access token if expired
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiryDate: Date;
}> {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await client.refreshAccessToken();

  return {
    accessToken: credentials.access_token || "",
    expiryDate: new Date(credentials.expiry_date || Date.now() + 3600000),
  };
}
