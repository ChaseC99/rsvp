"use client";

import { useRouter } from 'next/navigation'
import { Typography } from "@mui/material";
import EventForm from "../_components/event-form";
import { Event } from "../types";

export default function CreateEvent() {
    const router = useRouter();

    const handleSubmit = async (event: Partial<Event>) => {
        const endpoint = '/api/event';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...event }),
        }

        const response = await fetch(endpoint, options);

        if (response.ok) {
            const eventId = await response.json();
            router.push(`/${eventId}`);
        } else {
            alert('Something went wrong');
        }

        return Promise.resolve();
    }


    return (
        <div>
            <Typography variant="h1" style={styles.header}>
                Create Event
            </Typography>
            <EventForm onSubmit={handleSubmit} />
        </div>
    )
}

const styles = {
    header: {
        fontSize: "3rem",
        marginBottom: "2rem",
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '1rem',
    },
    submitButton: {
        marginTop: "1rem",
    }
}