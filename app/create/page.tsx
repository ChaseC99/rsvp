"use client";

import { useRef } from "react";
import { useRouter } from 'next/navigation'

export default function CreateEvent() {
    const router = useRouter();

    const titleRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const endpoint = '/api/event';
        const title = titleRef.current?.value;
        const date = dateRef.current?.value;
        const description = descriptionRef.current?.value;
        const location = locationRef.current?.value;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, date, description, location}),
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
            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input id="title" type="text" ref={titleRef}/>
                <label htmlFor="date">Date</label>
                <input id="date" type="date" ref={dateRef}/>
                <label htmlFor="description">Description</label>
                <textarea id="description" ref={descriptionRef}/>
                <label htmlFor="location">Location</label>
                <input id="location" type="text" ref={locationRef}/>
                <button type="submit">Create</button>           
            </form>
        </div>
    )
}