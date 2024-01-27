import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type CollapsableProps = {
    title: string,
    children: React.ReactNode,
    outlined?: boolean,
}
export default function Collapsable({ title, children, outlined }: CollapsableProps) {
    return (
        <Accordion 
            elevation={0} 
            disableGutters 
            sx={{
                ...styles.accordian,
                ...(outlined ? styles.outlined : {})
            }}>
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
    outlined: {
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        borderStyle: "solid",
        borderRadius: "4px",
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