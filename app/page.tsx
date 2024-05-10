"use client";
import { useState, useEffect } from 'react';
import { Divider, Typography } from "@mui/material";
import EventsList from "./events-list";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Event } from './types';
import Spinner from './_components/spinner';

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch events from API
    useEffect(() => {
        fetch('/api/events')
            .then((response) => response.json())
            .then((data) => {
                const events = data.map((event: Event) => ({
                    ...event,
                    date: new Date(event.date),
                }));
                setEvents(events)
                setIsLoading(false);
            });
    }, []);

    return (
        <div>
            {isLoading ? 
                <Spinner /> :
                <EventsList events={events} />
            }
        </div>
    )
}

const styles = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: "1rem",
    }
}