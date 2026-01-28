import { createEvents, type EventAttributes } from "ics";

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

    return {
      uid: event.uid,
      title: event.title,
      description: event.description || undefined,
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
      location: event.location || undefined,
      status: event.status.toUpperCase() as "TENTATIVE" | "CONFIRMED" | "CANCELLED",
      calName: calendarName,
      productId: "hotr-calendar-sync",
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
