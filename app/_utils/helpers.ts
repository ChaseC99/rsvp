import { Attendee } from "../types";

/**
 * Get Attendee Count
 * 
 * @param attendees 
 * @returns The number of attendees plus the number of guests
 */
export function getAttendeeCount(attendees: Attendee[]): number {
    return attendees.length - getMaybeCount(attendees) + attendees.reduce((acc, attendee) => acc + attendee.guests.length, 0);
}

/**
 * Get Maybe Count
 * 
 * @param attendees 
 * @returns The number of tentative attendees
 */
export function getMaybeCount(attendees: Attendee[]): number {
    return attendees.filter(attendee => attendee.tentative).length;
}

/**
 * Use Flag
 * 
 * Checks whether the url has a specific flag as a query parameter and returns a boolean
 * 
 * @param flag
 * @returns Boolean of whether the flag is present in the URL
 */
export function useFlag(flag: string): boolean {
    if (typeof window !== "undefined") { 
        return new URLSearchParams(window.location.search).has(flag);
    } else {
        return false;
    }
}