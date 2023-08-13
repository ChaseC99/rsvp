import { sql } from "@vercel/postgres";
import EventsList from "./events-list";
import type {
  Event,
} from "./types";

async function loadEvents(): Promise<Event[]> {
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
        GROUP BY e.id;`

  return result.rows.map((row) => row.event);
}

export default async function Home() {
  const events = await loadEvents()
  return (
    <div>
      <h1>RSVP</h1>
      <p>This site is still on the way...</p>
      <EventsList events={events} />
    </div>
  )
}
