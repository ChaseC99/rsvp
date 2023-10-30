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