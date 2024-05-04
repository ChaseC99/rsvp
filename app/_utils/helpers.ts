import { customAlphabet } from "nanoid";
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

/**
 * Generate Id
 * 
 * Generates a random 6 character alphanumeric string.
 * This should be able to generate 6k unique ids before a 1% chance of collision.
 * Nano ID Collision Probability: https://zelark.github.io/nano-id-cc/
 * 
 * @returns a unique id
 */
export function generateId(): string {
    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);
    return nanoid();
}