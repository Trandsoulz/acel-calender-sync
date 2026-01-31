import { randomBytes } from "crypto";

/**
 * Generate a unique slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);
}

/**
 * Generate a unique feed token for subscribers
 */
export function generateFeedToken(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Generate a stable event UID for ICS
 */
export function generateEventUid(eventId: string): string {
  return `event-${eventId}@hotrph.org`;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Check if a subscriber matches event targeting criteria
 */
export function matchesEventTargeting(
  subscriber: {
    gender: string;
    country: string;
    relationshipStatus: string;
    dob: Date;
  },
  event: {
    targetGenders: string[];
    targetAgeMin: number | null;
    targetAgeMax: number | null;
    targetCountries: string[];
    targetRelationshipStatuses: string[];
  }
): boolean {
  const subscriberAge = calculateAge(subscriber.dob);

  // Check gender (empty array means all genders)
  if (
    event.targetGenders.length > 0 &&
    !event.targetGenders.includes(subscriber.gender)
  ) {
    return false;
  }

  // Check age range
  if (event.targetAgeMin !== null && subscriberAge < event.targetAgeMin) {
    return false;
  }
  if (event.targetAgeMax !== null && subscriberAge > event.targetAgeMax) {
    return false;
  }

  // Check country (empty array means all countries)
  if (
    event.targetCountries.length > 0 &&
    !event.targetCountries.includes(subscriber.country)
  ) {
    return false;
  }

  // Check relationship status (empty array means all statuses)
  if (
    event.targetRelationshipStatuses.length > 0 &&
    !event.targetRelationshipStatuses.includes(subscriber.relationshipStatus)
  ) {
    return false;
  }

  return true;
}

/**
 * Format date for ICS (YYYYMMDDTHHMMSS format)
 */
export function formatDateForIcs(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * List of countries for dropdown
 */
export const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
  "Other",
] as const;

/**
 * List of relationship statuses
 */
export const RELATIONSHIP_STATUSES = [
  "single",
  "married",
  "divorced",
  "widowed",
] as const;

/**
 * List of genders
 */
export const GENDERS = ["male", "female"] as const;

/**
 * Default timezone for events (West Africa Time)
 */
export const DEFAULT_TIMEZONE = "Africa/Lagos";

/**
 * Format a UTC date to a datetime-local input value in Africa/Lagos timezone
 */
export function formatDateForInput(date: Date | string, timezone: string = DEFAULT_TIMEZONE): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  
  const parts = formatter.formatToParts(d);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || "00";
  
  // Format: YYYY-MM-DDTHH:mm (for datetime-local input)
  return `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart("hour")}:${getPart("minute")}`;
}

/**
 * Parse a datetime-local input value (in Africa/Lagos timezone) to UTC Date
 * The input is assumed to be in the specified timezone, and we need to store as UTC
 */
export function parseDateFromInput(dateTimeLocalValue: string, timezone: string = DEFAULT_TIMEZONE): Date {
  // The datetime-local value is like "2026-02-15T18:00"
  // We need to interpret this as Africa/Lagos time and convert to UTC
  
  // Parse the components
  const [datePart, timePart] = dateTimeLocalValue.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  
  // Create a date string that explicitly specifies the timezone
  // Africa/Lagos is UTC+1 (no DST)
  const isoString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  
  // Create date in the specified timezone by using a workaround:
  // Parse as UTC first, then adjust for the timezone offset
  const tempDate = new Date(isoString + "Z"); // Parse as UTC
  
  // Get the offset for Africa/Lagos (typically +1 hour, no DST)
  // Using a more reliable method to get the offset
  const targetDate = new Date(isoString);
  const utcDate = new Date(targetDate.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(targetDate.toLocaleString("en-US", { timeZone: timezone }));
  const offsetMs = utcDate.getTime() - tzDate.getTime();
  
  // Adjust the date by the offset
  return new Date(tempDate.getTime() + offsetMs);
}

/**
 * Format a date for display in Africa/Lagos timezone
 */
export function formatDateForDisplay(date: Date | string, timezone: string = DEFAULT_TIMEZONE): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  return d.toLocaleString("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
