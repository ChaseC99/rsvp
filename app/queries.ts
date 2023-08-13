import { sql } from "@vercel/postgres";

// Queries generated courtesy of GitHub Copilot :)

export const EVENTS_QUERY = sql`
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

export const EVENT_QUERY = (id: string) => sql`
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
