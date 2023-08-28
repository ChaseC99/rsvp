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
                        <div>
                            <Typography variant='h3' style={{ fontSize: "2rem" }}>
                                {title}
                            </Typography>
                            <Typography variant='body1' style={{ display: "flex", gap: "0.5rem" }}>
                                {date.toDateString()}
                                <Divider orientation="vertical" flexItem />
                                {location}
                            </Typography>
                        </div>
                        <div style={styles.attendeeCount}>
                            <Typography style={styles.count}>
                                {getAttendeeCount(attendees)}
                            </Typography>
                            <AccountCircleIcon fontSize="large"/>
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
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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