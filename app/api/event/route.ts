import { createEvent, updateEvent, deleteEvent } from "@/app/queries";

// Create a new event
export async function POST(request: Request): Promise<Response> {
    const {
        id,
        title,
        date,
        description,
        location,
    } = await request.json();

    const event = await createEvent({
        id,
        title,
        date: new Date(date),
        description,
        location,
        changelog: [],
        attendees: [],
    });
    
    return new Response(JSON.stringify(event), { status: 201 });
}

// Update an existing event
export async function PUT(request: Request): Promise<Response> {
    const event = await request.json();
    await updateEvent(event);
    return new Response(null, { status: 200 });
}

// Delete an event
export async function DELETE(request: Request): Promise<Response> {
    const { eventId } = await request.json();
    await deleteEvent(eventId);
    return new Response(null, { status: 204 });
}