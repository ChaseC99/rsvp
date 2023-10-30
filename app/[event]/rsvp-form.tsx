"use client";
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useRef, useState } from "react"

import type {
    Attendee,
} from "../types";
import LabeledCounterGroup from "../_components/labeled-counter-group";
import ListInput from "../_components/list-input";
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
    defaultSupplies?: string[], 
    isEditing?: boolean,
    onDelete?: (id: string) => void,
}

export default function RsvpForm(props: RSVPModalProps) {
    const { onSubmit, onDelete, onClose, defaultValues, defaultSupplies = [], isEditing = false } = props;
    const { id, name: initialName, guests: initialGuests, supplies: initialSupplies, tentative: initialTenative } = defaultValues || {};

    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [name, setName] = useState(initialName || "");
    const [guests, setGuests] = useState<string[]>(initialGuests || [""]);
    const [supplies, setSupplies] = useState<LabeledValue[]>(
        initialSupplies?.map(supply => ({ label: supply.item, value: supply.quantity })) || 
        defaultSupplies.map(defaultSupply => ({label: defaultSupply, value: 0})) as LabeledValue[]
    );
    const [tentative, setTentative] = useState(initialTenative || false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitIsLoading(true);

        const filteredGuests = guests.filter((guest) => guest !== "");
        const filteredSupplies = supplies.filter(({ label, value }) => label !== "" && value > 0)
            .map(({ label: item, value: quantity }) => ({ item, quantity }));

        await onSubmit({ 
            id, 
            name, 
            guests: filteredGuests, 
            supplies: filteredSupplies,
            tentative,
        });

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
        <form onSubmit={handleSubmit} style={styles.form}>
            <TextField
                id="name"
                label="Name"
                variant="outlined"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <FormControlLabel 
                control={
                    <Checkbox checked={tentative} onChange={(event) => setTentative(event.target.checked)} />
                } 
                label="Maybe coming" 
            />

            <Collapsable title="Supplies">
                <LabeledCounterGroup labels={supplies} onChange={(supplies) => setSupplies(supplies)} />
            </Collapsable>

            <Collapsable title="Guests">
                <ListInput placeholder="Guest" items={guests} onChange={(guests) => setGuests(guests)} />
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
    )
}

const styles = {    
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '1rem',
    },
}
