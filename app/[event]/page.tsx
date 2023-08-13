import { sql } from "@vercel/postgres";
import EventPage from "./event";

import type {
    Event,
} from "../types";

async function loadEvent(): Promise<Event> {
    // SQL query courtesy of ChatGPT :)
    const result = await sql`
    SELECT JSON_BUILD_OBJECT(
        'title', e.title,
        'id', e.id,
        'date', e.date,
        'description', e.description,
        'location', e.location,
        'attendees', JSON_AGG(
          JSON_BUILD_OBJECT(
            'name', a.name,
            'guests', a.guests,
            'supplies', (
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'item', s.item,
                  'quantity', s.quantity
                )
              )
              FROM supplies s
              WHERE s.id = a.supplies_id
            )
          )
        ),
        'changelog', e.changelog
      ) AS event
      FROM events e
      LEFT JOIN attendees a ON e.id = a.event_id
      WHERE e.id = 'event1'
      GROUP BY e.id;`;

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