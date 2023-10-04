import { Button, Tooltip } from "@mui/material";
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import { Event } from "../types"

type CalendarDownloadProps = {
    event: Event,
    tooltipOpen?: boolean,
    onOpen?: () => void,
    onClose?: () => void,
}

export default function CalendarDownload({ event, tooltipOpen, onOpen, onClose }: CalendarDownloadProps) {
    const { title, location } = event;
    
    // Add the location to the description, because gcal ios app doesn't include it :(
    var description = event.description ? event.description + `\n\nLocation: ${location}` : `Location: ${location}`;
    // Add the rsvp link to the description
    description += `\n\nhttps://rsvp.chase.link/${event.id}`;

    // Google Calendar requires the date to be in a specific format
    // YYYYMMDDTHHmmSSZ/YYYYMMDDTHHmmSSZ
    const date = event.date.toISOString().replace(/-|:|\.\d+/g, '');

    // Google Calendar add event url reference: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md#parameters
    const gcalAddEventUrl = new URL('https://www.google.com/calendar/render');
    gcalAddEventUrl.searchParams.append('action', 'TEMPLATE');
    gcalAddEventUrl.searchParams.append('text', title);
    gcalAddEventUrl.searchParams.append('dates', `${date}/${date}`);
    gcalAddEventUrl.searchParams.append('details', description);
    gcalAddEventUrl.searchParams.append('location', location);

    return (
        <Tooltip 
            title="Add to Google Calendar" 
            arrow 
            open={tooltipOpen} 
            onOpen={onOpen} 
            onClose={onClose}
        >
            <Button
                href={gcalAddEventUrl.toString()}
                target="_blank"
                rel="noreferrer"
            >
                <InsertInvitationIcon />
            </Button>
        </Tooltip>
    )
}