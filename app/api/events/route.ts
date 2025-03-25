import { loadEvents } from "@/app/queries";

export async function GET(request: Request): Promise<Response> {
    // Get private event IDs from query parameters
    const url = new URL(request.url);
    const privateEventIds = url.searchParams.get('private_ids');
    const privateEventIdsArray = privateEventIds ? privateEventIds.split(',') : [];

    const events = await loadEvents(privateEventIdsArray);

    return new Response(JSON.stringify(events), { status: 200 });
}

export const dynamic = 'force-dynamic';
