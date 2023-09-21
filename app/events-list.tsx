import Link from "next/link";
import { Card, Divider, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAttendeeCount } from "./_utils/helpers";
import type { Event } from "./types";

export default function EventsList({ events }: { events: Event[] }) {
    return (
        <div style={styles.wrapper}>
            {events.map(({ title, id, date, location, attendees }) => (
                <Link key={id} href={`/${id}`}>
                    <Card style={styles.card}>
                        <div style={styles.cardHeader}>
                            <Typography variant='h3' style={{ fontSize: "2rem" }}>
                                {title}
                            </Typography>
                            <div style={styles.attendeeCount}>
                                <Typography style={styles.count}>
                                    {getAttendeeCount(attendees)}
                                </Typography>
                                <AccountCircleIcon fontSize="large" />
                            </div>
                        </div>
                        <div>
                            <Typography variant='body1' style={{ display: "flex", gap: "0.5rem" }}>
                                {date.toDateString()}
                                <Divider orientation="vertical" flexItem />
                                {location}
                            </Typography>
                        </div>
                    </Card>
                </Link>
            ))
            }
        </div >
    )
}

const styles = {
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
    attendeeCount: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    count: {
        fontSize: "1.5rem",
    },
}