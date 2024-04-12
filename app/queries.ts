// NOTE: These exports can only be used by the /api and server rendered components
// If you need to use a query in a client side component, you should create a new api route
// that the client side component can call instead
import prisma from './db'
import type { Event, Attendee } from './types';
import { ONE_DAY } from './_utils/constants';

// EVENT QUERIES
/**
 * Loads all events
 * @returns a list of all events
 */
export async function loadEvents(includePastEvents = false): Promise<Event[]> {
    const events = includePastEvents ?
        await prisma.event.findMany({
            include: {
                attendees: {
                    include: { supplies: true }
                }
            }
        })
        :
        await prisma.event.findMany({
            where: {
                date: {
                    // All events newer than 24 hours ago
                    gte: new Date(Date.now() - ONE_DAY),
                },
                privateEvent: false
            },
            include: {
                attendees: {
                    include: { supplies: true }
                }
            }
        });

    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    return events;
}

/**
 * Load a single event by id
 * @param id Event id
 * @returns event if it exists
 */
export async function loadEvent(id: string): Promise<Event | null> {
    var event = await prisma.event.findUnique({
        where: {
            id: id
        },
        include: {
            attendees: {
                include: { supplies: true },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    if (!event) {
        // Check agin for a custom url
        event = await prisma.event.findUnique({
            where: {
                customUrl: id
            },
            include: {
                attendees: {
                    include: { supplies: true },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
    }

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
    // Attendees are updated separately, so it's fine to remove them from the event data
    const { attendees, ...eventData } = event;

    await prisma.event.update({
        where: {
            id: eventData.id
        },
        data: {
            ...eventData,
        }
    })
};

/**
 * Cancel an event
 * @param eventId
 */
export async function cancelEvent(eventId: string, cancelled: boolean): Promise<void> {
    await prisma.event.update({
        where: {
            id: eventId
        },
        data: {
            cancelled: cancelled
        }
    })
};

/**
 * Delete an event
 * @param eventId 
 */
export async function deleteEvent(eventId: string): Promise<void> {
    await prisma.event.delete({
        where: {
            id: eventId
        }
    })
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
        }
    })
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