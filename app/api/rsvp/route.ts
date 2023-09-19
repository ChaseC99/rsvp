import { createRsvp, deleteRsvp, updateRsvp } from "@/app/queries";

// Create a new RSVP to an event
export async function POST(request: Request): Promise<Response> {
    const { attendee } = await request.json();
    await createRsvp(attendee);
    return new Response(null, { status: 201 });
}

// Update an existing RSVP
export async function PUT(request: Request): Promise<Response> {
    const { attendee } = await request.json();
    await updateRsvp(attendee);
    return new Response(null, { status: 200 });
}

// Delete an RSVP
export async function DELETE(request: Request): Promise<Response> {
    const { attendeeId } = await request.json();
    await deleteRsvp(attendeeId);
    return new Response(null, { status: 204 });
}
