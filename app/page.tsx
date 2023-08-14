import EventsList from "./events-list";
import { loadEvents } from "./queries";

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
