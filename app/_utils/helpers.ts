import { customAlphabet } from "nanoid";
import { Attendee, Event } from "../types";

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

/**
 * Get Stored Private Event Ids
 */
export function getStoredPrivateEventIds(): string[] {
    if (typeof window !== "undefined") { 
        const privateEventIds = localStorage.getItem("private_event_ids");
        return privateEventIds ? JSON.parse(privateEventIds) : [];
    } else {
        return [];
    }
}

/**
 * Save Private Event Id
 * 
 * Adds a private event id to local storage if it doesn't already exist.
 * This is used to store private event ids that the user has seen.
 */
export function savePrivateEventId(eventId: string): void {
    if (typeof window !== "undefined") { 
        const privateEventIds = getStoredPrivateEventIds();

        // Check if the event ID already exists in local storage
        if (!privateEventIds.includes(eventId)) {
            localStorage.setItem("private_event_ids", JSON.stringify([...privateEventIds, eventId]));
        }
    }
}

/** 
 * Load Events
 */
export function loadEventsList(): Promise<Event[]> {
    // Load private event IDs stored in local storage
    const privateEventIds = getStoredPrivateEventIds().join(',');

    const eventsUrl = privateEventIds
        ? `/api/events?private_ids=${privateEventIds}`
        : '/api/events';

    return fetch(eventsUrl)
        .then((response) => response.json())
        .then((data) => {
            return data.map((event: Event) => ({
                ...event,
                date: new Date(event.date),
            }));
        });
}