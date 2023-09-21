import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Collapsable({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <Accordion elevation={0} disableGutters style={styles.accordian}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={styles.summary}
            >
                <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails style={styles.details}>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

const styles = {
    accordian: {
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    },
    summary: {
        flexDirection: "row-reverse" as const,
        padding: 0,
        gap: "0.5rem",
    },
    details: {
        maxHeight: "100%",
        padding: 8,
    }
}