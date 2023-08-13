import EventsList from "./events-list";
import { EVENTS_QUERY } from "./queries";
import type {
  Event,
} from "./types";

async function loadEvents(): Promise<Event[]> {
  const result = await EVENTS_QUERY;

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
