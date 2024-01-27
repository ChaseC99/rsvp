"use client";

import { useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import Collapsable from "./collapsable";
import ListInput from "./list-input";
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
    const [defaultSupplies, setDefaultSupplies] = useState(event?.defaultSupplies || []);
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
            defaultSupplies,
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

            <Collapsable title="Suggested Supplies">
                <ListInput 
                    placeholder="Supply"
                    items={defaultSupplies} 
                    onChange={(defaultSupplies) => setDefaultSupplies(defaultSupplies)} 
                />
            </Collapsable>

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