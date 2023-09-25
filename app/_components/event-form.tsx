"use client";

import { useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import DatePicker from "../_components/date-picker";
import { Event } from "../types";


type EventFormProps = {
    submitButtonText: string,
    onSubmit: (event: Partial<Event>) => Promise<void>,
    event?: Event,
};
export default function EventForm(props: EventFormProps) {
    const { event, submitButtonText, onSubmit } = props;

    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [title, setTitle] = useState(event?.title || "");
    const [date, setDate] = useState(event?.date || "");
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitIsLoading(true);

        const description = descriptionRef.current?.value;
        const location = locationRef.current?.value;

        const event = {
            title,
            date: new Date(date),
            description,
            location,
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

            <DatePicker onChange={setDate} defaultValue={event?.date} />

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
                    "Las Palmas Park", "Kevin Morran Park", "Washington Park"
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