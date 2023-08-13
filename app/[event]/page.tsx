import EventPage from "./event";
import { EVENT_QUERY } from "../queries";

import type {
    Event,
} from "../types";

async function loadEvent(id: string): Promise<Event> {
    const result = await EVENT_QUERY(id);
    return result.rows[0].event;
}

// This is a server-side rendered component,
// so that it can easily load data from the database
// The event data is then passed into EventPage,
// which is a client-side rendered component
export default async function EventPageLoader(
    props: { params: { event: string } },
) {
    // Get the event id from the URL
    const { params: { event: eventId } } = props;
    const event = await loadEvent(eventId);

    return <EventPage event={event} />
}