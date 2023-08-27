"use client";
import * as React from 'react';
import { useState } from 'react';
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

export default function Navbar() {
    const router = useRouter();
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
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
                        RSVP
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
                    {['Event 0', 'Event 1', 'Event 2'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                                <h2>{text}</h2>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}