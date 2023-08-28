import { Attendee } from "../types";

/**
 * Get Attendee Count
 * 
 * @param attendees 
 * @returns The number of attendees plus the number of guests
 */
export function getAttendeeCount(attendees: Attendee[]): number {
    return attendees.length + attendees.reduce((acc, attendee) => acc + attendee.guests.length, 0);
}