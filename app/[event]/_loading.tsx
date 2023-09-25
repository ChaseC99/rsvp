// Temporarily disabling loading page by renaming it to _loading.tsx
// because a bug in Next.js causes Suspense to throw a hydration error
// Rename to loading.tsx when the bug is fixed

import { Divider, Skeleton } from "@mui/material";

export default function LoadingEvent() {
    return (
        <div>
            <Skeleton height={100} width="80%" /> {/* Title */}
            <Skeleton height={125} width="40%" /> {/* Details */}
            <Skeleton height={70} width={90} />  {/* RSVP Button */}
            <div>
                <Skeleton height={40} width="50%" /> {/* Attending Header */}
                <Divider />
                <Skeleton height={200} width={100} /> {/* Attending List */}
            </div>
        </div>
    )
}

const styles = {
    page: {
        display: "flex",
        flexDirection: "column" as "column",
    }
}