import EventPage from "./event";

import type { 
    Event, 
} from "../types";

function loadEvent(): Promise<Event> {
    // TODO: Load event from database
    return Promise.resolve({
        title: 'VolleyBAYll',
        date: '2021-01-01',
        description: 'My Event Description',
        location: 'Las Palmas Park, Sunnyvale, CA',
        attendees: [
            { name: 'Chase', supplies: [{ item: 'Ball', quantity: 1 }], guests: ['Kasey'] },
            { name: 'Ashwin', supplies: [{ item: 'Ball', quantity: 1 }, { item: 'Net', quantity: 1 }], guests: ['Vivian'] },
            { name: 'Jiwan', supplies: [{ item: 'Ball', quantity: 1 }, { item: 'Net', quantity: 2 }] }
        ],
        changelog: [],
    });
}

// This is a server-side rendered component,
// so that it can easily load data from the database
// The event data is then passed into EventPage,
// which is a client-side rendered component
export default async function EventPageLoader() {
    const event = await loadEvent();
    
    return <EventPage event={event} />
}