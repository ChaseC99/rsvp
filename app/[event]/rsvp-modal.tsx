"use client";
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useRef, useState } from "react"

import type {
    Attendee,
} from "../types";
import LabeledCounterGroup from "../_components/labeled-counter-group";
import GuestListInput from "../_components/guests-list-input";
import Collapsable from "../_components/collapsable";
import { LabeledValue } from "../_components/labeled-counter";
import { LoadingButton } from "@mui/lab";

export type RSVPModalSubmitProps = {
    name: string,
    guests: string[],
    supplies: { item: string; quantity: number; }[],
}

type RSVPModalProps = {
    onSubmit: (attendee: Partial<Attendee>) => void,
    onClose: () => void,
    defaultValues?: Partial<Attendee> | null,
    isEditing?: boolean,
    onDelete?: (id: string) => void,
}

export default function RsvpModal(props: RSVPModalProps) {
    const { onSubmit, onDelete, onClose, defaultValues, isEditing = false } = props;
    const { id, name: initialName, guests: initialGuests, supplies: initialSupplies } = defaultValues || {};

    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [name, setName] = useState(initialName || "");
    const [guests, setGuests] = useState<string[]>(initialGuests || [""]);
    const [supplies, setSupplies] = useState<LabeledValue[]>(
        initialSupplies?.map(supply => ({ label: supply.item, value: supply.quantity })) || []
    );
    // TODO: implement tdb on backend
    const tbdRef = useRef<HTMLButtonElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitIsLoading(true);

        // create uuid

        const filteredGuests = guests.filter((guest) => guest !== "");
        const filteredSupplies = supplies.filter(({ label, value }) => label !== "" && value > 0)
            .map(({ label: item, value: quantity }) => ({item, quantity }));

        await onSubmit({ id, name, guests: filteredGuests, supplies: filteredSupplies });

        setSubmitIsLoading(false);
        onClose();
    }

    const handleDelete = async () => {
        if (!onDelete || !id) return;
        
        setSubmitIsLoading(true);
        await onDelete(id);
        setSubmitIsLoading(false);
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
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <FormControlLabel control={<Checkbox ref={tbdRef} />} label="Tentatively coming" />

                <Collapsable title="Supplies">
                    <LabeledCounterGroup labels={supplies} onChange={(supplies) => setSupplies(supplies)} />
                </Collapsable>

                <Collapsable title="Guests">
                    <GuestListInput guests={guests} onChange={(guests) => setGuests(guests)} />
                </Collapsable>

                <LoadingButton
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={name === ""}
                    loading={submitIsLoading}
                >
                    {isEditing ? "Update RSVP" : "RSVP"}
                </LoadingButton>

                {
                    isEditing && (
                        <LoadingButton
                            variant="contained"
                            color="error"
                            disableElevation
                            onClick={handleDelete}
                            loading={submitIsLoading}
                        >
                            Delete
                        </LoadingButton>
                    )
                }
            </form>
        </Box>
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
}
