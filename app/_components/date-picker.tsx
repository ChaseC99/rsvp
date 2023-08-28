import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';

type DatePickerProps = {
    ref: React.ForwardedRef<HTMLInputElement>;
}

export default function DatePicker(props: DatePickerProps) {
    return (
        <div style={styles.wrapper}>
            <label htmlFor="date">
                <CalendarMonthTwoToneIcon fontSize='large'/>
            </label>
            <input 
                id="date" 
                type="datetime-local" 
                ref={props.ref} 
                style={styles.dateInput}
            />
        </div>
    )
}

const styles = {
    wrapper: {
        padding: "1rem, 0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        height: "3.5rem",
    },
    dateInput: {
        fontSize: "1rem",
    }
}