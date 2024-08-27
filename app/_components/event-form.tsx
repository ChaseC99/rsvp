"use client";

import { useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField, Checkbox, FormControlLabel, InputAdornment } from "@mui/material";
import Collapsable from "./collapsable";
import ListInput from "./list-input";
import DatePicker from "../_components/date-picker";
import { Event } from "../types";
import { useFlag } from "../_utils/helpers";


type EventFormProps = {
    submitButtonText: string,
    onSubmit: (event: Partial<Event>) => Promise<void>,
    event?: Event,
};
export default function EventForm(props: EventFormProps) {
    const { event, submitButtonText, onSubmit } = props;

    const enableAdvancedFeatures = useFlag("advanced")

    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [title, setTitle] = useState(event?.title || "");
    const [date, setDate] = useState(event?.date || "");
    const [defaultSupplies, setDefaultSupplies] = useState(event?.defaultSupplies || []);
    const [privateEvent, setPrivateEvent] = useState(event?.privateEvent || false);
    const durationRef = useRef<HTMLInputElement>(null);
    const customUrlRef = useRef<HTMLTextAreaElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitIsLoading(true);

        const duration = durationRef.current?.value ? parseFloat(durationRef.current.value) : null;
        const description = descriptionRef.current?.value;
        const location = locationRef.current?.value;
        const customUrl = customUrlRef.current?.value;

        const event = {
            title,
            date: new Date(date),
            duration,
            description,
            location,
            defaultSupplies,
            privateEvent,
            customUrl
        };

        await onSubmit(event);

        setSubmitIsLoading(false);
    };


    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <TextField
                id="title"
                label="Title"
                variant="outlined"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />

            <DatePicker 
                onChange={setDate} 
                defaultValue={event?.date} 
                label="Start Time"
            />

            <TextField 
                type="number"
                label="Duration"
                variant="outlined"
                inputRef={durationRef}
                defaultValue={event?.duration}
                InputProps={{
                    endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                }}
            />

            <Autocomplete
                id="location"
                freeSolo
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Location"
                        multiline
                        inputRef={locationRef}
                    />
                )}
                options={[
                    "Las Palmas Park", "Kevin Moran Park", "Washington Park"
                ]}
                defaultValue={event?.location}
            />


            <TextField
                id="description"
                label="Description"
                variant="outlined"
                multiline
                inputRef={descriptionRef}
                defaultValue={event?.description}
            />

            <Collapsable title="Suggested Supplies" outlined={true}>
                <ListInput 
                    placeholder="Supply"
                    items={defaultSupplies} 
                    onChange={(defaultSupplies) => setDefaultSupplies(defaultSupplies)} 
                />
            </Collapsable>

            { enableAdvancedFeatures && (
                <Collapsable title="Advanced Features" outlined={true}>
                    <div style={styles.form}>
                        <p>Welcome to the admin zone 😎</p>
                        <TextField
                            id="customUrl"
                            label="Custom ID"
                            variant="outlined"
                            multiline
                            inputRef={customUrlRef}
                            defaultValue={event?.customUrl}
                        />
                        <FormControlLabel 
                            control={
                                <Checkbox checked={privateEvent} onChange={(event) => setPrivateEvent(event.target.checked)} />
                            } 
                            label={privateEvent ? "Private Event (⚠️ Only visible to those who have the link)" : "Private Event" }
                        />
                    </div>
                </Collapsable>
            )}

            <LoadingButton
                disabled={title === ""}
                type="submit"
                variant="contained"
                size="large"
                style={styles.submitButton}
                loading={submitIsLoading}
            >
                {submitButtonText}
            </LoadingButton>
        </form>
    )
}

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '1rem',
    },
    submitButton: {
        marginTop: "1rem",
    },
}