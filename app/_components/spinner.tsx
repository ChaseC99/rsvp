import { CircularProgress } from "@mui/material";

export default function Spinner() {
    return (
        <div style={styles.spinner}>
            <CircularProgress />
        </div>
    )
}

const styles = {
    spinner: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        margin: "1rem 0",
    }
}