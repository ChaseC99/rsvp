"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Event } from './types';

export default function Navbar() {
    const router = useRouter();
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    // Fetch events from API
    useEffect(() => {
        fetch('/api/events')
            .then((response) => response.json())
            .then((data) => {
                const events = data.map((event: Event) => ({
                    ...event,
                    date: new Date(event.date),
                }));
                setEvents(events)
            }
            );
    }, []);

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        id="menu-button"
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setMenuIsOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <label htmlFor="menu-button">
                            RSVP
                        </label>
                    </Typography>
                    <Link href="create">
                        <AddCircleOutlineIcon />
                    </Link>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor='left'
                open={menuIsOpen}
                onClose={() => setMenuIsOpen(false)}
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                router.push("/");
                                setMenuIsOpen(false);
                            }}
                        >
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary={"All events"} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {events.map((event) => (
                        <div key={event.id}>
                            <ListItem>
                                <ListItemButton
                                    onClick={() => {
                                        router.push(`/${event.id}`);
                                        setMenuIsOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={event.title}
                                        secondary={event.date.toDateString()}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider variant='middle' />
                        </div>
                    ))}
                </List>
            </Drawer>
        </>
    );
}