"use client";
import { useRouter } from "next/navigation";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, Modal, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import type {
    Attendee,
    Event,
} from "../types";
import CategoryIcon from '@mui/icons-material/Category';
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';

import RsvpForm from "./rsvp-form";
import { getAttendeeCount, getMaybeCount } from "../_utils/helpers";
import EventForm from "../_components/event-form";
import ModalContent from "../_components/modal-content";
import EventMenu from "./event-menu";
import CalendarDownload from "./calendar-download";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type EventDetailProps = {
    icon: React.ReactNode,
    text: string,
}
function EventDetail({ icon, text }: EventDetailProps) {
    return (
        <div style={styles.detail}>
            {icon}
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {text}
            </Typography>
        </div>
    )
}

type LocationProps = {
    location: string,
}
function Location({ location }: LocationProps) {
    const [preferAppleMaps, setPreferAppleMaps] = useState(false);
    useEffect(() => {
        // Note: navigator.platform is deprecated but iOS still supports it
        if (navigator.platform.includes('iPhone')) {
            setPreferAppleMaps(true);
        }
    }, [])

    if (!location) return null;

    // If the user is on an iPhone, use the Apple Maps URL
    // Otherwise, use the Google Maps URL
    const mapsUrl = preferAppleMaps ?
        `http://maps.apple.com?q=${encodeURIComponent(location)}` :
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

    return (
        <a href={mapsUrl} target="_blank">
            <EventDetail
                icon={<PublicTwoToneIcon />}
                text={location}
            />
        </a>
    )
}

type AttendeeRowProps = {
    attendee: Attendee,
    onClick: (attendee: Partial<Attendee>) => void,
}
function AttendeeRow(props: AttendeeRowProps) {
    const { attendee, onClick } = props;

    const handleOnClick = (attendee: Partial<Attendee>) => {
        onClick(attendee);
    }

    return (
        <ListItem key={attendee.id} onClick={() => handleOnClick(attendee)} sx={styles.attendee}>
            <ListItemText>
                <Typography variant="h6">
                    {attendee.name + (attendee.tentative ? " (maybe)" : "")}
                </Typography>

                <div style={styles.attendeeDetails}>
                    {attendee.comment &&
                        // Comment shoud take up the full width
                        <p style={{ width: "100%" }}>
                            <i>{attendee.comment}</i>
                        </p>
                    }
                    {attendee.guests.length > 0 &&
                        <div style={styles.attendeeDetailsRow}>
                            <PeopleIcon />
                            <p>{attendee.guests.join(", ")}</p>
                        </div>
                    }
                    {attendee.supplies.length > 0 &&
                        <div style={styles.attendeeDetailsRow}>
                            <CategoryIcon />
                            <p>{attendee.supplies.map(({ item, quantity }) => `${quantity} ${item}`).join(", ")}</p>
                        </div>
                    }
                </div>
            </ListItemText>
        </ListItem>
    )
}

type AttendeesProps = {
    attendees: Attendee[],
    onClick: (attendee: Partial<Attendee>) => void,
}
function Attendees(props: AttendeesProps) {
    const { attendees, onClick } = props;
    const numAttending = getAttendeeCount(attendees);
    const numMaybe = getMaybeCount(attendees);

    if (attendees.length === 0) return null;

    let countString = `${numAttending} Going`;
    if (numMaybe > 0) {
        countString += ` · ${numMaybe} Maybe`;
    }

    return (
        <div>
            <Typography variant="h5">{countString}</Typography>
            <Divider />
            <List>
                {attendees.map((attendee) => (
                    <AttendeeRow
                        key={attendee.id}
                        attendee={attendee}
                        onClick={onClick}
                    />
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
    const [calendarTooltipOpen, setCalendarTooltipOpen] = useState(false);
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

    const handleCancelEvent = async () => {
        const endpoint = `/api/event`;

        const data = {
            eventId: id,
            cancelled: !event.cancelled
        }

        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data }),
        }

        const resp = await fetch(endpoint, options);

        router.refresh();

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
        const endpoint = '/api/rsvp';

        const data = {
            attendee: {
                ...rspv,
                eventId: id,
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

        // Wait half a second, then show the calendar tooltip
        // to let the user know they can download the event
        setTimeout(() => setCalendarTooltipOpen(true), 500);
        // Wait 8 seconds, then hide the calendar tooltip
        setTimeout(() => setCalendarTooltipOpen(false), 8000);

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

    const eventDate = date.toDateString();
    const eventTime = date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });

    return (
        <div>
            {event.privateEvent && (
                <Alert severity="info" style={{ marginBottom: 16 }}>
                    This is a private event.<br />Only guests with the link can view it.
                </Alert>
            )}

            {event.cancelled && (
                <Alert severity="error" style={{ marginBottom: 16 }}>
                    This event has been cancelled
                </Alert>
            )}
            <div style={{ ...styles.header, ...(event.cancelled ? styles.cancelled : {}) }}>
                <Typography variant="h2">
                    {title}
                </Typography>
            </div>

            <div style={{ ...styles.details, ...(event.cancelled ? styles.cancelled : {}) }}>
                <Location location={location} />
                <EventDetail
                    icon={<CalendarMonthTwoToneIcon />}
                    text={eventDate}
                />
                {
                    // Don't show the time if it's 12:00 AM
                    // 12:00 AM is the default when no time is specified
                    eventTime !== '12:00 AM' &&
                    <EventDetail
                        icon={<ScheduleIcon />}
                        text={eventTime}
                    />
                }
                <div style={styles.markdownText}>
                    <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
                </div>
            </div>

            <div style={styles.buttonRow}>
                <Button
                    onClick={() => setShowRsvp(true)}
                    variant="contained"
                    color="success"
                    size="large"
                    disabled={event.cancelled}
                >
                    RSVP
                </Button>

                <div style={styles.iconButtons}>
                    <CalendarDownload
                        event={event}
                        disabled={event.cancelled}
                        tooltipOpen={calendarTooltipOpen}
                        onOpen={() => setCalendarTooltipOpen(true)}
                        onClose={() => setCalendarTooltipOpen(false)}
                    />

                    <EventMenu
                        cancelled={event.cancelled}
                        onEdit={() => setShowEditEvent(true)}
                        onCancel={handleCancelEvent}
                        onDelete={() => setShowDeleteEvent(true)}
                    />
                </div>
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

            {/* Create RSVP Modal */}
            <Modal
                open={showRsvp}
                onClose={() => setShowRsvp(false)}
            >
                <ModalContent>
                    <RsvpForm
                        onClose={() => setShowRsvp(false)}
                        onSubmit={handleCreateRsvp}
                        defaultSupplies={event.defaultSupplies}
                    />
                </ModalContent>
            </Modal>

            {/* Edit RSVP Modal */}
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
                        defaultSupplies={event.defaultSupplies}
                        onDelete={handleDeleteRsvp}
                    />
                </ModalContent>
            </Modal>

            {/* Edit Event Modal */}
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

            {/* Delete Event Dialog */}
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
    cancelled: {
        textDecoration: 'line-through',
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
    buttonRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '2rem 0',
    },
    iconButtons: {
        display: 'flex',
    },
    markdownText: {
        whiteSpace: 'pre-wrap' as const,

        // Styling to match the Typography component
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: 1.5,
        letterSpacing: "0.00938em",
    },
    attendee: {
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        borderStyle: "solid",
        borderRadius: "4px",
        backgroundColor: "#80808020",

        marginBottom: "1rem",
    },
    attendeeDetails: {
        display: "flex",
        gap: "0.3rem 2rem",
        flexWrap: "wrap" as "wrap",
    },
    attendeeDetailsRow: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: "0.5rem",
    },
};
