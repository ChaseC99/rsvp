import { Divider, Typography } from "@mui/material";
import EventsList from "./events-list";
import { loadEvents } from "./queries";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

export default async function Home() {
    const events = await loadEvents()

    return (
        <div>
            <div style={styles.header}>
                <Typography>
                    This site is still on the way...
                </Typography>
                <DirectionsRunIcon />
            </div>
            <Divider />
            <EventsList events={events} />
        </div>
    )
}

const styles = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: "1rem",
    }
}