import { loadEvents } from "@/app/queries";

export async function GET(request: Request): Promise<Response> {
    const events = await loadEvents();

    return new Response(JSON.stringify(events), { status: 200 });
}