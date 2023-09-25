import { useState } from "react"
import { Button, Divider, Menu, MenuItem } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';

type EventMenuProps = {
    onEdit: () => void,
    onDelete: () => void,
};
export default function EventMenu(props: EventMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        props.onEdit();
        handleClose();
    }

    const handleDeleteClick = async () => {
        await props.onDelete();
        handleClose();
    }

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <EditIcon />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEditClick}>Edit Event</MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteClick}>Delete Event</MenuItem>
            </Menu>
        </div>
    );
};