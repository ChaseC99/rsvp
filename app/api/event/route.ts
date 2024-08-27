import { generateId } from "@/app/_utils/helpers";
import { createEvent, updateEvent, deleteEvent, cancelEvent } from "@/app/queries";

// Create a new event
export async function POST(request: Request): Promise<Response> {
    const {
        title,
        date,
        description,
        duration,
        cancelled,
        defaultSupplies,
        location,
        privateEvent,
        customUrl
    } = await request.json();

    const event = await createEvent({
        id: generateId(),
        title,
        date: new Date(date),
        description,
        duration,
        location,
        cancelled,
        defaultSupplies,
        changelog: [],
        attendees: [],
        privateEvent,
        customUrl
    });
    
    return new Response(JSON.stringify(event), { status: 201 });
}

// Update an existing event
export async function PUT(request: Request): Promise<Response> {
    const event = await request.json();
    await updateEvent(event);
    return new Response(null, { status: 200 });
}

// Patch an existing event (cancel/uncancel)
export async function PATCH(request: Request): Promise<Response> {
    const { eventId, cancelled } = await request.json();
    await cancelEvent(eventId, cancelled);
    return new Response(null, { status: 200 });
}

// Delete an event
export async function DELETE(request: Request): Promise<Response> {
    const { eventId } = await request.json();
    await deleteEvent(eventId);
    return new Response(null, { status: 204 });
}