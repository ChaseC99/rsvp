// NOTE: These exports can only be used by the /api and server rendered components
// If you need to use a query in a client side component, you should create a new api route
// that the client side component can call instead
import { PrismaClient } from '@prisma/client'
import type { Event, Attendee } from './types';

// Initial Prisma client 
const prisma = new PrismaClient()

// EVENT QUERIES
/**
 * Loads all events
 * @returns a list of all events
 */
export async function loadEvents(): Promise<Event[]> {
    const events = await prisma.event.findMany({
        include: { 
            attendees: {
                include: { supplies: true }
            }
         }
    });
    return events;
}

/**
 * Load a single event by id
 * @param id Event id
 * @returns event if it exists
 */
export async function loadEvent(id: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({
        where: {
            id: id
        },
        include: {
            attendees: {
                include: { supplies: true }
            }
        }
    });
    return event;
}

/**
 * Create a new event
 * @param event
 * @returns id of the created event
 */
export async function createEvent(event: Event): Promise<String> {
    // Attendees are created separately, so it's fine to remove them from the event data
    const { attendees, ...eventData } = event;

    const createdEvent = await prisma.event.create({
        data: {
            ...eventData,
        }
    });
    
    return createdEvent.id;
};

/**
 * Update an existing event
 * @param event 
 */
export async function updateEvent(event: Event): Promise<void> {
    // TODO
};

/**
 * Delete an event
 * @param eventId 
 */
export async function deleteEvent(eventId: string): Promise<void> {
    // TODO
};

// RSVP QUERIES
/**
 * Create a new attendee for an event
 * @param attendee 
 * @param eventId 
 */
export async function createRsvp(attendee: Attendee): Promise<void> {
    const resp = await prisma.attendee.create({
        data: {
            ...attendee,
            supplies: {
                create: attendee.supplies
            },
        }
    });
}

/**
 * Update an attendee for an event
 * @param attendee 
 * @param eventId 
 */
export async function updateRsvp(attendee: Attendee): Promise<void> {
    await prisma.attendee.update({
        where: {
            id: attendee.id
        },
        data: {
            ...attendee,
            supplies: {
                deleteMany: {},    
                create: attendee.supplies
            },
        }})
}

/**
 * Deletes an attendee for an event
 * @param attendeeId 
 */
export async function deleteRsvp(attendeeId: string): Promise<void> {
    await prisma.attendee.delete({
        where: {
            id: attendeeId
        }
    })
}