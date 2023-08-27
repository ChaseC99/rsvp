"use client";
import { Box, Button, Checkbox, FormControlLabel, Modal, TextField } from "@mui/material";
import { useRef, useState } from "react"
import type {
    Attendee,
    Event,
} from "../types";
import LabeledCounterGroup from "../_components/labeled-counter-group";
import GuestListInput from "../_components/guests-list-input";
import Collapsable from "../_components/collapsable";
import { LabeledValue } from "../_components/labeled-counter";

function RsvpModal({ eventId, onClose }: { eventId: string, onClose: () => void }) {
    const [name, setName] = useState("");
    const tbdRef = useRef<HTMLButtonElement>(null); // TODO: implement tdb on backend
    const [guests, setGuests] = useState<string[]>([""]);
    const [supplies, setSupplies] = useState<LabeledValue[]>([]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const endpoint = '/api/rsvp';

        const filteredSupplies = supplies.filter(({label, value}) => label !== "" && value > 0).map(({label: item, value: quantity}) => ({item, quantity}));
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
                <FormControlLabel control={<Checkbox ref={tbdRef}/>} label="Tentatively coming" />
                
                <Collapsable title="Supplies">
                    <LabeledCounterGroup labels={supplies} onChange={(supplies) => setSupplies(supplies)}/>
                </Collapsable>

                <Collapsable title="Guests">
                    <GuestListInput guests={guests} onChange={(guests) => setGuests(guests)}/>
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
    const supplies = Object.values(attendees).reduce((acc, attendee) => {
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

    return (
        <div>
            <h2>Supplies</h2>
            <ul>
                {/* Iterate over the supplies */}
                {Object.entries(supplies).map(([item, quantity]) => (
                    <li key={item}>
                        {quantity} {item}
                        {quantity > 1 ? "s" : ""}
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
                <h3>{date.toDateString()}</h3>
            </div>

            <Button 
                onClick={() => setShowRsvp(true)}
                variant="contained"
                color="success"
            >
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
    }
};
