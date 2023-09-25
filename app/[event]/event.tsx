"use client";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, Modal, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react"
import type {
    Attendee,
    Event,
} from "../types";
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import ScheduleIcon from '@mui/icons-material/Schedule';

import RsvpForm from "./rsvp-form";
import { getAttendeeCount } from "../_utils/helpers";
import EventForm from "../_components/event-form";
import ModalContent from "../_components/modal-content";
import EventMenu from "./event-menu";

type EventDetailProps = {
    icon: React.ReactNode,
    text: string,
}
function EventDetail({ icon, text }: EventDetailProps) {
    return (
        <div style={styles.detail}>
            {icon}
            <Typography variant="body1">{text}</Typography>
        </div>
    )
}

type AttendeeProps = {
    attendees: Attendee[],
    onClick: (attendee: Partial<Attendee>) => void,
}
function Attendees(props: AttendeeProps) {
    const { attendees, onClick } = props;
    const numAttending = getAttendeeCount(attendees);

    if (numAttending === 0) return null;

    const handleOnClick = (attendee: Partial<Attendee>) => {
        onClick(attendee);
    }

    return (
        <div>
            <Typography variant="h5">Attending · {numAttending}</Typography>
            <Divider />
            <List>
                {attendees.map((attendee) => (
                    <ListItem key={attendee.id} onClick={() => handleOnClick(attendee)}>
                        <ListItemText>
                            {attendee.name}
                            {attendee.guests.length > 0 &&
                                <p>Guests: {attendee.guests.join(", ")}</p>
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
            let { item, quantity } = supply;
            item = item.toLowerCase();
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

type SuppliesProps = {
    supplies: [string, number][],
}
function Supplies({ supplies }: SuppliesProps) {
    if (supplies.length === 0) return null;

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

type ChangelogProps = {
    changes: string[],
}
function Changelog({ changes }: ChangelogProps) {
    if (changes.length === 0) return null;

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



type EventPageProps = {
    event: Event,
}
export default function EventPage({ event }: EventPageProps) {
    const router = useRouter();

    const [showRsvp, setShowRsvp] = useState(false);
    const [showEditRsvp, setShowEditRsvp] = useState(false);
    const [showEditEvent, setShowEditEvent] = useState(false);
    const [showDeleteEvent, setShowDeleteEvent] = useState(false);
    const [rsvpDefaultValues, setRsvpDefaultValues] = useState<Partial<Attendee> | null>(null);
    const deleteEventPasswordRef = useRef<HTMLInputElement>(null);
    const { title, id, date, description, location, attendees, changelog } = event;
    const supplies = getSuppliesFromAttendees(attendees);

    const handleEditEvent = async (event: Partial<Event>) => {
        const endpoint = `/api/event`;

        const data = {
            ...event,
            id,
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data }),
        }

        const resp = await fetch(endpoint, options);
        // TODO: handle response

        router.refresh();
        setShowEditEvent(false)

        return Promise.resolve();
    }

    const handleDeleteEvent = async () => {
        // I know, super secure right?
        // Maybe we'll do real auth later but for now this is 
        // mainly to prevent accidental deletion.
        const password = deleteEventPasswordRef.current?.value;
        if (password !== 'passwort') {
            alert('Incorrect password');
            return Promise.resolve();
        }

        const endpoint = `/api/event`;

        const data = {
            eventId: id,
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        const resp = await fetch(endpoint, options);
        // TODO: handle response

        router.push('/');

        return Promise.resolve();
    }

    const handleCreateRsvp = async (rspv: Partial<Attendee>) => {
        const { name, guests, supplies } = rspv;
        const endpoint = '/api/rsvp';

        const data = {
            attendee: {
                name,
                eventId: id,
                supplies,
                guests
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

        router.refresh();

        return Promise.resolve();
    }

    const handleUpdateRsvp = async (rspv: Partial<Attendee>) => {
        const endpoint = '/api/rsvp';

        const data = {
            attendee: {
                ...rspv,
            }
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        const resp = await fetch(endpoint, options);
        // TODO: handle response

        router.refresh();

        return Promise.resolve();
    }

    const handleDeleteRsvp = async (id: string) => {
        const endpoint = '/api/rsvp';

        const data = {
            attendeeId: id,
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        const resp = await fetch(endpoint, options);
        // TODO: handle response

        router.refresh();

        return Promise.resolve();
    }

    const onAttendeeClick = (attendee: Partial<Attendee>) => {
        setRsvpDefaultValues(attendee);
        setShowEditRsvp(true);
    }

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
                <EventDetail
                    icon={<ScheduleIcon />}
                    text={
                        date.toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                        })
                    }
                />
                <Typography variant="body1">{description}</Typography>
            </div>

            <div style={styles.buttonRow}>
                <Button
                    onClick={() => setShowRsvp(true)}
                    variant="contained"
                    color="success"
                    size="large"
                >
                    RSVP
                </Button>

                <EventMenu
                    onEdit={() => setShowEditEvent(true)}
                    onDelete={() => setShowDeleteEvent(true)}
                />
            </div>

            <Attendees
                attendees={attendees}
                onClick={onAttendeeClick}
            />
            <Supplies supplies={supplies} />
            <Changelog changes={changelog} />

            {/* POPUPS
            The following are modals and dialogs that are normally hidden
            but may be shown depending on user interaction 
            */}
            <Modal
                open={showRsvp}
                onClose={() => setShowRsvp(false)}
            >
                <ModalContent>
                    <RsvpForm
                        onClose={() => setShowRsvp(false)}
                        onSubmit={handleCreateRsvp}
                    />
                </ModalContent>
            </Modal>
            <Modal
                open={showEditRsvp}
                onClose={() => setShowEditRsvp(false)}
            >
                <ModalContent>
                    <RsvpForm
                        isEditing={true}
                        onClose={() => setShowEditRsvp(false)}
                        onSubmit={handleUpdateRsvp}
                        defaultValues={rsvpDefaultValues}
                        onDelete={handleDeleteRsvp}
                    />
                </ModalContent>
            </Modal>
            <Modal
                open={showEditEvent}
                onClose={() => setShowEditEvent(false)}
            >
                <ModalContent>
                    <EventForm
                        event={event}
                        submitButtonText="Update Event"
                        onSubmit={handleEditEvent}
                    />
                </ModalContent>
            </Modal>
            <Dialog 
                open={showDeleteEvent} 
                onClose={() => setShowDeleteEvent(false)}
                fullWidth
            >
                <DialogTitle>Delete Event</DialogTitle>
                <DialogContent>
                    <TextField
                        inputRef={deleteEventPasswordRef}
                        autoFocus
                        label="Password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setShowDeleteEvent(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={async () => {
                            await handleDeleteEvent()
                            setShowDeleteEvent(false)
                        }}
                        color='error'
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const styles = {
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
    buttonRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '2rem 0',
    },
};
