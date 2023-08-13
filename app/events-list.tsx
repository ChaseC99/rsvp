import Link from "next/link";
import type { 
    Event, 
} from "./types";

export default function EventsList({events}: {events: Event[]}) {
    return (
        <div>
            <h1>Events</h1>
            <ul>
                {events.map(({ title, id, date }) => (
                    <li key={id}>
                        <Link href={`/${encodeURIComponent(id)}`}>
                            {title}
                        </Link>
                        <br />
                        {date}
                    </li>
                ))}
            </ul>
        </div>
    )
}