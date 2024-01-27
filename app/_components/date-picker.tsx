import { useRef } from 'react';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { ONE_DAY } from '../_utils/constants';


type DatePickerProps = {
    onChange: (date: string) => void;
    defaultValue?: Date;
    label: string;
}

export default function DatePicker(props: DatePickerProps) {
    const { onChange, defaultValue, label } = props;
    const defaultDate = defaultValue?.toLocaleDateString("fr-CA") || "";    // HACK: Using fr-CA to get YYYY-MM-DD format in local time
    let defaultTime = defaultValue?.toTimeString().slice(0, 5) || "";       // Slicing to get HH:MM format
    if (defaultTime === "00:00") {
        defaultTime = "";
    }
    
    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    const handleChange = () => {
        const date = dateRef.current?.value;
        const time = timeRef.current?.value;

        if (!date) {
            onChange("");
        } else if (!time) {
            onChange(`${date}T00:00`);
        } else {
            onChange(`${date}T${time}`);
        }
    }

    return (
        <div style={styles.datePickerWrapper}>
            <label style={styles.datePickerLabel}>{label}</label>
            <div style={styles.datePicker}>
                <div style={styles.inputWrapper}>
                    <label htmlFor="date">
                        <CalendarMonthTwoToneIcon fontSize='large' />
                    </label>
                    <input
                        id="date"
                        type="date"
                        ref={dateRef}
                        style={styles.dateInput}
                        onChange={handleChange}
                        defaultValue={defaultDate}

                        // Min date is today minus one day
                        // ISO string is sliced into YYYY-MM-DD format
                        min={new Date(Date.now() - ONE_DAY).toISOString().slice(0, 10)}
                    />
                </div>

                <div style={styles.inputWrapper}>
                    <label htmlFor="time">
                        <ScheduleIcon fontSize='large' />
                    </label>
                    <input
                        id="time"
                        type="time"
                        ref={timeRef}
                        style={styles.dateInput}
                        onChange={handleChange}
                        defaultValue={defaultTime}
                    />
                </div>
            </div>
        </div>
    )
}

const styles = {
    datePickerWrapper: {
        borderWidth: "1px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        borderStyle: "solid",
        borderRadius: "4px",
    },
    datePickerLabel: {
        fontFamily: "Roboto,Helvetica,Arial,sans-serif",
        fontWeight: 400,
        fontSize: "1rem",
        color: "rgba(0, 0, 0, 0.6)",
        transform: "translate(10px, -8px) scale(0.75)",
        transformOrigin: "top left",
        position: "absolute" as "absolute",
        background: "white",
        padding: "0px 5px",
    },
    datePicker: {
        padding: "1rem 0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "3.5rem",
        flexWrap: "wrap" as "wrap",
        gap: "0.75rem",
    },
    inputWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
    },
    dateInput: {
        fontSize: "1rem",
        padding: 4,
    }
}