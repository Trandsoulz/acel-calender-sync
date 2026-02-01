import { createEvents, type EventAttributes } from "ics";

// Default church location
const DEFAULT_LOCATION = "PLOT F/23 SANI ABACHA ROAD, GRA PHASE III, PORTHARCOURT";

// Default event description footer with church info
const DEFAULT_DESCRIPTION_FOOTER = `

---

MORE INFORMATION

SOCIAL MEDIA
Facebook: https://www.facebook.com/houseontherockportharcourt
Instagram: https://www.instagram.com/hotrportharcourt
TikTok: https://www.tiktok.com/@hotrportharcourt

OFFICIAL WEBSITE
https://www.hotrportharcourt.com

CONTACT US
Phone: +234 903 989 3477
WhatsApp: +234 809 111 8522

OFFICIAL WHATSAPP CHANNEL
Get church flyers, service invites, and videos to share!
https://whatsapp.com/channel/0029Va4Ul825kg7Az6a5T03e

LIVESTREAM LINKS
Facebook: https://www.facebook.com/houseontherockportharcourt
YouTube: https://youtube.com/@houseontherockportharcourt
iRadio: https://www.heritageiradio.com

ATTENDANCE & REGISTRATION
Get barcode for check-in: https://www.member.hotrportharcourt.com

---
House on the Rock, Port Harcourt`;

interface CalendarEvent {
  id: string;
  uid: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  timezone: string;
  location: string | null;
  status: string;
}

interface GenerateIcsOptions {
  calendarName: string;
  events: CalendarEvent[];
}

/**
 * Generate an ICS file content from events
 */
export async function generateIcsContent({
  calendarName,
  events,
}: GenerateIcsOptions): Promise<string> {
  const icsEvents: EventAttributes[] = events.map((event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    // Build description: admin's description + default footer
    const fullDescription = (event.description || "") + DEFAULT_DESCRIPTION_FOOTER;

    return {
      uid: event.uid,
      title: event.title,
      description: fullDescription,
      start: [
        start.getFullYear(),
        start.getMonth() + 1,
        start.getDate(),
        start.getHours(),
        start.getMinutes(),
      ] as [number, number, number, number, number],
      end: [
        end.getFullYear(),
        end.getMonth() + 1,
        end.getDate(),
        end.getHours(),
        end.getMinutes(),
      ] as [number, number, number, number, number],
      location: event.location || DEFAULT_LOCATION,
      status: event.status.toUpperCase() as "TENTATIVE" | "CONFIRMED" | "CANCELLED",
      calName: calendarName,
      productId: "hotr-calendar-sync",
      // Reminder alarms
      alarms: [
        {
          action: "display" as const,
          description: "Event reminder",
          trigger: { hours: 72, before: true },
        },
        {
          action: "display" as const,
          description: "Event reminder",
          trigger: { hours: 24, before: true },
        },
        {
          action: "display" as const,
          description: "Event reminder",
          trigger: { hours: 1, before: true },
        },
        {
          action: "display" as const,
          description: "Event reminder",
          trigger: { minutes: 15, before: true },
        },
      ],
    };
  });

  return new Promise((resolve, reject) => {
    if (icsEvents.length === 0) {
      // Return empty calendar if no events
      resolve(
        `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HOTR Calendar Sync//hotrph.org//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${calendarName}
X-WR-TIMEZONE:Africa/Lagos
END:VCALENDAR`
      );
      return;
    }

    createEvents(icsEvents, (error, value) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(value);
    });
  });
}

/**
 * Generate calendar subscription URLs for different platforms
 */
export function generateSubscriptionUrls(
  baseUrl: string,
  calendarSlug: string,
  feedToken: string
): {
  icsUrl: string;
  googleUrl: string;
  appleUrl: string;
  outlookUrl: string;
} {
  const icsUrl = `${baseUrl}/calendar/${calendarSlug}/feed/${feedToken}.ics`;
  const webcalUrl = icsUrl.replace(/^https?:/, "webcal:");

  return {
    icsUrl,
    googleUrl: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`,
    appleUrl: webcalUrl,
    outlookUrl: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(icsUrl)}`,
  };
}
