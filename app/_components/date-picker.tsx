import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';

type DatePickerProps = {
    onChange: (date: string) => void;
}

export default function DatePicker(props: DatePickerProps) {
    const {onChange} = props;
    return (
        <div style={styles.wrapper}>
            <label htmlFor="date">
                <CalendarMonthTwoToneIcon fontSize='large'/>
            </label>
            <input 
                id="date" 
                type="datetime-local" 
                style={styles.dateInput}
                onChange={(e) => onChange(e.target.value)}
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