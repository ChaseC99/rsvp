import { rsvpToEvent } from "@/app/queries";

export async function POST(request: Request): Promise<Response> {
    const { attendee, eventId } = await request.json();
    await rsvpToEvent(attendee, eventId);
    return new Response(null, { status: 201 });
}