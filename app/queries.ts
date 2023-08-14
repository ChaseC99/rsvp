// NOTE: These exports can only be used by the /api and server rendered components
// because the sql import needs the postgres .env variable, which is not available on the client
import { db, sql } from "@vercel/postgres";
import { Attendee, Event } from "./types";

export async function loadEvents(): Promise<Event[]> {
    const result = await EVENTS_QUERY;
    return result.rows.map((row) => row.event);
}

export async function loadEvent(id: string): Promise<Event> {
    const result = await EVENT_QUERY(id);
    return result.rows[0].event;
}

export async function rsvpToEvent(attendee: Attendee, eventId: string): Promise<void> {
    const { name } = attendee;
    await db.query(RSVP_TO_EVENT, [name, eventId]);
}

// Queries generated courtesy of GitHub Copilot :)
const EVENTS_QUERY = sql`
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
GROUP BY e.id;`

const EVENT_QUERY = (id: string) => sql`
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
WHERE e.id = ${id}
GROUP BY e.id;`;

const RSVP_TO_EVENT = `
    INSERT INTO attendees (name, event_id, supplies_id, guests)
    VALUES ($1, $2, NULL, NULL)`