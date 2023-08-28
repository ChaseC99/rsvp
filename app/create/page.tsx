"use client";

import { useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import DatePicker from "../_components/date-picker";

export default function CreateEvent() {
    const router = useRouter();

    const [title, setTitle] = useState("")
    const dateRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const endpoint = '/api/event';
        const date = dateRef.current?.value;
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
            // TODO: Navigate to new event id
            const data = await response.json();
            console.log(data);
        } else {
            alert('Something went wrong');
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

                <DatePicker ref={dateRef} />

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

                <Button
                    disabled={title === ""}
                    type="submit"
                    variant="contained"
                    size="large"
                    style={styles.submitButton}
                >
                    Create event
                </Button>
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