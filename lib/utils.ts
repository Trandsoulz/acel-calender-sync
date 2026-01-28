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
