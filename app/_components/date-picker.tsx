import { useRef } from 'react';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { ONE_DAY } from '../_utils/constants';


type DatePickerProps = {
    onChange: (date: string) => void;
}

export default function DatePicker(props: DatePickerProps) {
    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);
    const { onChange } = props;

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
        <div style={styles.wrapper}>
            <div style={styles.input}>
                <label htmlFor="date">
                    <CalendarMonthTwoToneIcon fontSize='large' />
                </label>
                <input
                    id="date"
                    type="date"
                    ref={dateRef}
                    style={styles.dateInput}
                    onChange={handleChange}
                    width="100%"

                    // Min date is today minus one day
                    // ISO string is sliced into YYYY-MM-DD format
                    min={new Date(Date.now() - ONE_DAY).toISOString().slice(0, 10)}
                />
            </div>

            <div style={styles.input}>
                <label htmlFor="time">
                    <ScheduleIcon fontSize='large' />
                </label>
                <input
                    id="time"
                    type="time"
                    ref={timeRef}
                    style={styles.dateInput}
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}

const styles = {
    wrapper: {
        padding: "1rem, 0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "3.5rem",
        flexWrap: "wrap" as "wrap",
        gap: "0.75rem",
    },
    input: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
    },
    dateInput: {
        fontSize: "1rem",
    }
}