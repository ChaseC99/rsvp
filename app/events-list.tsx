"use client";
import Link from "next/link";
import { Alert, Card, Divider, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAttendeeCount } from "./_utils/helpers";
import type { Event } from "./types";

export default function EventsList({ events }: { events: Event[] }) {
    return (
        <div style={styles.wrapper}>
            {events.map(({ title, id, date, location, attendees, cancelled }) => (
                <Link key={id} href={`/${id}`}>
                    <Card style={styles.card}>
                        <div style={styles.cardHeader}>
                            <Typography variant='h3' style={{...styles.title, ...(cancelled && styles.cancelled)}}>
                                {title}
                            </Typography>
                            <div style={styles.attendeeCount}>
                                <Typography style={styles.count}>
                                    {getAttendeeCount(attendees)}
                                </Typography>
                                <AccountCircleIcon fontSize="large" />
                            </div>
                        </div>
                        <div style={{...(cancelled && styles.cancelled)}}>
                            <Typography variant='body1' style={{ display: "flex", gap: "0.5rem" }}>
                                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                <Divider orientation="vertical" flexItem />
                                {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                            </Typography>
                            <Typography variant='body1'>
                                {location}
                            </Typography>
                        </div>
                        {cancelled && (
                            <Alert severity="error" style={{marginTop: 16}}>
                                This event has been cancelled
                            </Alert>
                        )}
                    </Card>
                </Link>
            ))
            }
        </div >
    )
}

const styles = {
    cancelled: {
        textDecoration: "line-through",
    },
    wrapper: {
        margin: "1rem 0",
        display: "flex",
        flexDirection: "column" as "column",
        gap: "2rem",
    },
    card: {
        padding: "2rem",
    },
    cardHeader: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "2rem",
        marginBottom: "1rem",
    },
    title: {
        fontSize: "2rem",
    },
    attendeeCount: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    count: {
        fontSize: "1.5rem",
    },
}