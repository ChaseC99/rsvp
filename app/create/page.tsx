"use client";

import { useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField, Typography } from "@mui/material";
import DatePicker from "../_components/date-picker";

export default function CreateEvent() {
    const router = useRouter();

    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitIsLoading(true)

        const endpoint = '/api/event';
        const description = descriptionRef.current?.value;
        const location = locationRef.current?.value;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, date, description, location }),
        }

        const response = await fetch(endpoint, options);

        if (response.ok) {
            const eventId = await response.json();
            router.push(`/${eventId}`);
        } else {
            alert('Something went wrong');
            setSubmitIsLoading(false);
        }
    }


    return (
        <div>
            <Typography variant="h1" style={styles.header}>
                Create Event
            </Typography>
            <form onSubmit={handleSubmit} style={styles.form}>
                <TextField
                    id="title"
                    label="Title"
                    variant="outlined"
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />

                <DatePicker onChange={setDate} />

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
                />


                <TextField
                    id="description"
                    label="Description"
                    variant="outlined"
                    multiline
                    inputRef={descriptionRef}
                />

                <LoadingButton
                    disabled={title === ""}
                    type="submit"
                    variant="contained"
                    size="large"
                    style={styles.submitButton}
                    loading={submitIsLoading}
                >
                    Create event
                </LoadingButton>
            </form>
        </div>
    )
}

const styles = {
    header: {
        fontSize: "3rem",
        marginBottom: "2rem",
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '1rem',
    },
    submitButton: {
        marginTop: "1rem",
    }
}