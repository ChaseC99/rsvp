"use client";
import { useState, useEffect } from 'react';
import { Divider, Typography } from "@mui/material";
import EventsList from "./events-list";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Event } from './types';
import Spinner from './_components/spinner';
import { loadEventsList } from './_utils/helpers';

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch events from API
    useEffect(() => {
        loadEventsList()
            .then((events) => {
                setEvents(events);
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