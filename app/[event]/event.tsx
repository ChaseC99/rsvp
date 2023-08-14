"use client";
import { Box, Button, Modal } from "@mui/material";
import { useRef, useState } from "react"
import type {
    Attendee,
    Event,
    Supply,
} from "../types";

function RsvpModal({ eventId, onClose }: { eventId: string, onClose: () => void }) {
    const nameRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const endpoint = '/api/rsvp';
        const name = nameRef.current?.value;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventId, attendee: { name } }),
        }

        await fetch(endpoint, options);
        onClose();
    }

    return (
        <Box sx={styles.modal}>
            <form onSubmit={handleSubmit} method="post">
                <input type="text" id="name" ref={nameRef} placeholder="Name" />
                <button type="submit">RSVP</button>
            </form>
        </Box>
    )
}

function Attending(attendees: Attendee[]) {
    return (
        <div>
            <h2>Attending</h2>
            <ul>
                {attendees.map(({ name }) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
        </div>
    )
}

function Supplies(attendees: Attendee[]) {
    const supplies = Object.values(attendees.reduce((acc, attendee) => {
        if (!attendee.supplies) return acc;

        attendee.supplies.forEach((supply) => {
            const { item, quantity } = supply;
            if (acc[item]) {
                acc[item].quantity += 1;
            } else {
                acc[item] = { item, quantity };
            }
        });
        return acc;
    }, {} as Record<string, Supply>));

    return (
        <div>
            <h2>Supplies</h2>
            <ul>
                {supplies.map(({ item, quantity }) => (
                    <li key={item}>
                        {quantity} {item}{quantity > 1 ? 's' : ''}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function Changelog(changes: string[]) {
    return (
        <div>
            <h2>Changelog</h2>
            <ul>
                {changes.map((change) => (
                    <li key={change}>{change}</li>
                ))}
            </ul>
        </div>
    )
}

export default function EventPage({ event }: { event: Event }) {
    const [showRsvp, setShowRsvp] = useState(false);
    const { title, id, date, description, location, attendees, changelog } = event;

    return (
        <div>
            <h1>{title}</h1>
            <div>
                <h3>{location}</h3>
                <h3>{date}</h3>
            </div>

            <Button onClick={() => setShowRsvp(true)}>
                RSVP
            </Button>

            {Attending(attendees)}
            {Supplies(attendees)}
            {Changelog(changelog)}

            <Modal
                open={showRsvp}
                onClose={() => setShowRsvp(false)}
            >
                <div>
                    <RsvpModal
                        eventId={id}
                        onClose={() => setShowRsvp(false)}
                    />
                </div>
            </Modal>
        </div>
    )
}

const styles = {
    modal: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }
};
