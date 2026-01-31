import { google } from "googleapis";

// Default event description footer with church info
const DEFAULT_DESCRIPTION_FOOTER = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MORE INFORMATION

📱 SOCIAL MEDIA
• Facebook: https://www.facebook.com/houseontherockportharcourt
• Instagram: https://www.instagram.com/hotrportharcourt
• TikTok: https://www.tiktok.com/@hotrportharcourt

🌐 OFFICIAL WEBSITE
https://www.hotrportharcourt.com

📞 CONTACT US
• Phone: +234 903 989 3477
• WhatsApp: +234 809 111 8522

📲 OFFICIAL WHATSAPP CHANNEL
Get church flyers, service invites, and videos to share!
https://whatsapp.com/channel/0029Va4Ul825kg7Az6a5T03e

📺 LIVESTREAM LINKS
• Facebook: https://www.facebook.com/houseontherockportharcourt
• YouTube: https://youtube.com/@houseontherockportharcourt
• iRadio: https://www.heritageiradio.com

✅ ATTENDANCE & REGISTRATION
Get barcode for check-in: https://www.member.hotrportharcourt.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
House on the Rock, Port Harcourt`;

// Create OAuth2 client dynamically to ensure env vars are loaded
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
  );
}

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
  const oauth2Client = getOAuth2Client();
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
  const oauth2Client = getOAuth2Client();
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
  const client = getOAuth2Client();

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
 * Convert an event ID to a valid Google Calendar event ID
 * Google requires: 5-1024 chars, only lowercase a-v and digits 0-9 (base32hex)
 */
function toGoogleEventId(id: string): string {
  // Convert each character to its hex code, which gives us 0-9 and a-f
  // This ensures we only use valid characters
  let result = "";
  for (const char of id) {
    result += char.charCodeAt(0).toString(16);
  }
  // Ensure minimum length of 5
  while (result.length < 5) {
    result += "0";
  }
  return result.toLowerCase();
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

  // Google Calendar event IDs have strict requirements
  const googleEventId = toGoogleEventId(event.id);

  // Build description: admin's description + default footer
  const fullDescription = (event.description || "") + DEFAULT_DESCRIPTION_FOOTER;

  const eventData = {
    summary: event.title,
    description: fullDescription,
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
      eventId: googleEventId,
      requestBody: eventData,
    });
  } catch {
    // Event doesn't exist, create it
    await calendar.events.insert({
      calendarId: googleCalendarId,
      requestBody: {
        ...eventData,
        id: googleEventId,
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

  // Convert to valid Google event ID format
  const googleEventId = toGoogleEventId(eventId);

  try {
    await calendar.events.delete({
      calendarId: googleCalendarId,
      eventId: googleEventId,
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
  const client = getOAuth2Client();

  client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await client.refreshAccessToken();

  return {
    accessToken: credentials.access_token || "",
    expiryDate: new Date(credentials.expiry_date || Date.now() + 3600000),
  };
}
