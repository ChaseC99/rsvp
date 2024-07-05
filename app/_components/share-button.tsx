import { useState } from 'react'
import { Button, Snackbar } from '@mui/material'
import IosShareIcon from '@mui/icons-material/IosShare';

export default function ShareButton() {
    const [open, setOpen] = useState(false);

    // Open the share sheet on mobile, copy the URL to the clipboard on desktop
    const shareUrl = () => {
        if (navigator.share) {
            navigator.share({url: window.location.href}).catch(() => {
                console.log('share sheet closed');
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setOpen(true);
        }
    }

    return (
        <div>
            <Button onClick={shareUrl}>
                <IosShareIcon sx={{height: 22}}/>
            </Button>
            <Snackbar
                open={open}
                message="Link copied to clipboard"
                autoHideDuration={2000}
                onClose={() => {setOpen(false)}}
            />
        </div>
    )
}

