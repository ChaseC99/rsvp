"use client";
import { useState, useEffect } from 'react';
import { Divider, Typography } from "@mui/material";
import EventsList from "./events-list";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Event } from './types';

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);    

    // Fetch events from API
    useEffect(() => {
        fetch('/api/events')
            .then((response) => response.json())
            .then((data) => {
                const events = data.map((event: Event) => ({
                    ...event,
                    date: new Date(event.date),
                }));
                setEvents(events)}
            );
    }, []);

    return (
        <div>
            <div style={styles.header}>
                <Typography>
                    This site is still on the way...
                </Typography>
                <DirectionsRunIcon />
            </div>
            <Divider />
            <EventsList events={events} />
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