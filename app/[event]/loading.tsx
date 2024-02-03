import { Divider, Skeleton } from "@mui/material";

function EventDetailSkeleton({ width }: { width: string | number }) {
    return (
        <div style={{display: "flex", gap: 8}}>
            <Skeleton animation={false} variant="circular" height={30} width={30} />
            <Skeleton variant="text" width={width} />
        </div>
    )
}

export default function LoadingEvent() {
    return (
        <div style={styles.page}>
            {/* Title */}
            <Skeleton variant="rounded" height={100} width="100%" /> 
            
            {/* Event Details */}
            <EventDetailSkeleton width="80%"/>  {/* Location */}
            <EventDetailSkeleton width={100} /> {/* Date */}
            <EventDetailSkeleton width={60} />  {/* Time */}
            <Skeleton variant="text" height={80} width="100%" /> {/* Description */}
            
            {/* Button Row */}
            <div style={styles.buttonRow}>
                {/* RSVP Button */}
                <Skeleton variant="rounded" animation={false} height={50} width={100} />  
                <div style={{display: "flex", gap: 32}}>
                    {/* Calendar Button */}
                    <Skeleton variant="rounded" animation={false} height={35} width={35} />  
                    {/* Edit Button */}
                    <Skeleton variant="rounded" animation={false} height={35} width={35} />  
                </div>
            </div>
            
            <div>
                <Skeleton variant="rounded" height={50} width="calc(50%)" /> {/* Attending Header */}
                <Divider style={{margin: "2px 0 8px 0"}}/>
                <div style={styles.attendeeList}>
                    <Skeleton variant="rounded" height={60} width="100%" /> {/* Attendee */}
                    <Skeleton variant="rounded" height={60} width="100%" /> {/* Attendee */}
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "1rem",
    },
    buttonRow: {
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
    },
    attendeeList: {
        display: "flex", 
        flexDirection: "column" as "column", 
        gap: 16,
    }
}