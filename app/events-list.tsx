"use client";
import Link from "next/link";
import { Alert, Card, Divider, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAttendeeCount } from "./_utils/helpers";
import type { Event } from "./types";

export default function EventsList({ events }: { events: Event[] }) {
    return (
        <div style={styles.wrapper}>
            {events.map(({ title, id, date, location, attendees, cancelled }) => {
                const dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

                return (
                    <Link key={id} href={`/${id}`} style={styles.link}>
                        <Card style={styles.card}>
                            <div style={styles.cardHeader}>
                                <Typography variant='h3' style={{ ...styles.title, ...(cancelled && styles.cancelled) }}>
                                    {title}
                                </Typography>
                                <div style={styles.attendeeCount}>
                                    <Typography style={styles.count}>
                                        {getAttendeeCount(attendees)}
                                    </Typography>
                                    <AccountCircleIcon fontSize="large" />
                                </div>
                            </div>
                            <div style={{ ...(cancelled && styles.cancelled) }}>
                                <Typography variant='body1' style={{ display: "flex", gap: "0.5rem" }}>
                                    {dateString}
                                    {
                                        // Don't show the time if it's 12:00 AM
                                        // 12:00 AM is the default when no time is specified
                                        timeString !== '12:00 AM' && (
                                            <>
                                                <Divider orientation="vertical" flexItem />
                                                {timeString}
                                            </>
                                        )
                                    }
                                </Typography>
                                <Typography variant='body1'>
                                    {location}
                                </Typography>
                            </div>
                            {cancelled && (
                                <Alert severity="error" style={{ marginTop: 16 }}>
                                    This event has been cancelled
                                </Alert>
                            )}
                        </Card>
                    </Link>
                )
            })}
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
    link: {
        textDecoration: "none",
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