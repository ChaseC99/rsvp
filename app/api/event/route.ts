import { createEvent } from "@/app/queries";

// Create a new event
// Request body format:
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