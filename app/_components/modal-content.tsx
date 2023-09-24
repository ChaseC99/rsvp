import { Box } from "@mui/material";

export default function ModalContent(props: { children: React.ReactNode }) {
    return (
        <div>
            <Box sx={styles.modal}>
                {props.children}
            </Box>
        </div>
    );
}

const styles = {
    modal: {
        maxHeight: '90vh',
        maxWidth: '90vw',
        width: '100%',
        overflowY: 'scroll' as 'scroll',
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
    },
}