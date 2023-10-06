import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type CollapsableProps = {
    title: string,
    children: React.ReactNode,
}
export default function Collapsable({ title, children }: CollapsableProps) {
    return (
        <Accordion elevation={0} disableGutters sx={styles.accordian}>
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
        '&:before': {
            backgroundColor: 'transparent !important',
        },
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