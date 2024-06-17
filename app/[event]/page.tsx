import EventPage from "./event";
import { loadEvent } from "../queries";
import { Metadata, ResolvingMetadata } from 'next'

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

    if (!event) {
        return <div>Event not found</div>
    }

    return <EventPage event={event} />
}

 
type MetaDataProps = {
    params: { event: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }

export async function generateMetadata(
    { params }: MetaDataProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Get the event id from the URL
    const { event: eventId } = params;
    const event = await loadEvent(eventId);

    if (!event) {
        return {
            title: 'Event not found',
        }
    }

    const dateString = event.date.toLocaleDateString(
        'en-US', 
        { 
            weekday: 'long', 
            month: 'numeric', 
            day: 'numeric', 
            // HACK: Server is UTC but client is most likely Pacific Time, 
            // so force the timezone to be Pacific Time
            timeZone: "America/Los_Angeles" 
        })
    const title = `${event.title} | ${dateString}`;

    return {
        title: title,
    }
};