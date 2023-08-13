import { sql } from "@vercel/postgres";
import EventPage from "./event";
import { EVENT_QUERY } from "../queries";

import type {
    Event,
} from "../types";

async function loadEvent(): Promise<Event> {
    const result = await EVENT_QUERY('event1');

    const event = result.rows[0].event;

    return event;
}

// This is a server-side rendered component,
// so that it can easily load data from the database
// The event data is then passed into EventPage,
// which is a client-side rendered component
export default async function EventPageLoader() {
    const event = await loadEvent();

    return <EventPage event={event} />
}