"use client";
import { Box, Button, Checkbox, Divider, FormControlLabel, List, ListItem, ListItemText, Modal, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react"
import type {
    Attendee,
    Event,
} from "../types";
import LabeledCounterGroup from "../_components/labeled-counter-group";
import GuestListInput from "../_components/guests-list-input";
import Collapsable from "../_components/collapsable";
import { LabeledValue } from "../_components/labeled-counter";
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';

function RsvpModal({ eventId, onClose }: { eventId: string, onClose: () => void }) {
    const [name, setName] = useState("");
    const tbdRef = useRef<HTMLButtonElement>(null); // TODO: implement tdb on backend
    const [guests, setGuests] = useState<string[]>([""]);
    const [supplies, setSupplies] = useState<LabeledValue[]>([]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const endpoint = '/api/rsvp';

        const filteredSupplies = supplies.filter(({ label, value }) => label !== "" && value > 0).map(({ label: item, value: quantity }) => ({ item, quantity }));
        const filteredGuests = guests.filter((guest) => guest !== "");

        const data = {
            attendee: {
                name,
                eventId,
                supplies: filteredSupplies,
                guests: filteredGuests,
            }
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        const resp = await fetch(endpoint, options);
        // TODO: handle response

        onClose();
    }

    return (
        <Box sx={styles.modal}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    required
                    onChange={(event) => setName(event.target.value)}
                />
                <FormControlLabel control={<Checkbox ref={tbdRef} />} label="Tentatively coming" />

                <Collapsable title="Supplies">
                    <LabeledCounterGroup labels={supplies} onChange={(supplies) => setSupplies(supplies)} />
                </Collapsable>

                <Collapsable title="Guests">
                    <GuestListInput guests={guests} onChange={(guests) => setGuests(guests)} />
                </Collapsable>

                <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={name === ""}
                >
                    RSVP
                </Button>
            </form>
        </Box>
    )
}

function EventDetail({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div style={styles.detail}>
            {icon}
            <Typography variant="body1">{text}</Typography>
        </div>
    )
}

function Attending(attendees: Attendee[]) {
    const numAttending = attendees.length;
    const numGuests = attendees.reduce((acc, attendee) => acc + attendee.guests.length, 0);
    const total = numAttending + numGuests;

    return (
        <div>
            <Typography variant="h5">Attending · {total}</Typography>
            <Divider />
            <List>
                {attendees.map(({ name, guests }) => (
                    <ListItem key={name}>
                        <ListItemText>
                            {name} 
                            {guests.length > 0 &&
                                <p>Guests: {guests.join(", ")}</p>
                            }
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

function getSuppliesFromAttendees(attendees: Attendee[]) {
    const suppliesMap = Object.values(attendees).reduce((acc, attendee) => {
        if (!attendee.supplies) return acc;

        attendee.supplies.forEach((supply) => {
            const { item, quantity } = supply;
            if (acc[item]) {
                acc[item] += 1;
            } else {
                acc[item] = quantity;
            }
        });
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(suppliesMap);
};

function Supplies(supplies: [string, number][]) {
    return (
        <div>
            <Typography variant="h5">Supplies</Typography>
            <Divider />
            <List>
                {/* Iterate over the supplies */}
                {supplies.map(([item, quantity]) => (
                    <ListItem key={item}>
                        <ListItemText>
                            {quantity} {item}
                            {quantity > 1 ? "s" : ""}
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

function Changelog(changes: string[]) {
    return (
        <div>
            <Typography variant="h5">Changelog</Typography>
            <Divider />
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
    const supplies = getSuppliesFromAttendees(attendees);

    return (
        <div>
            <div style={styles.header}>
                <Typography variant="h2">
                    {title}
                </Typography>
            </div>

            <div style={styles.details}>
                <EventDetail
                    icon={<PublicTwoToneIcon />}
                    text={location}
                />
                <EventDetail
                    icon={<CalendarMonthTwoToneIcon />}
                    text={date.toDateString()}
                />
            </div>

            <Button
                onClick={() => setShowRsvp(true)}
                variant="contained"
                color="success"
                style={styles.rsvp}
                size="large"
            >
                RSVP
            </Button>

            {attendees.length > 0 && Attending(attendees)}
            {supplies.length > 0 && Supplies(supplies)}
            {changelog.length > 0 && Changelog(changelog)}

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
        maxHeight: '90vh',
        maxWidth: '90vw',
        width: '100%',
        overflowY: 'scroll' as 'scroll',
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '1rem',
    },
    header: {
        marginBottom: '1rem',
    },
    details: {
        margin: '1rem 0',
    },
    detail: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        margin: '8px 0',
    },
    rsvp: {
        margin: '1rem 0',
    },
};
