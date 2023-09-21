import * as React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, TextField } from '@mui/material';

type NumberInputProps = {
    value: number,
    onChange: (value: number) => void,
}
const NumberInput = React.forwardRef(function NumberInput(
    props: NumberInputProps,
) {
    const increment = () => {
        if (isNaN(props.value)) {
            // If the value is NaN, the text field is probably blank
            // Set the value to 1, as if the text field was 0
            props.onChange(1);
        } else {
            props.onChange(props.value + 1)
        }
    }

    const decrement = () => {
        if (props.value > 0) {
            // Check to make sure the value is greater than 0
            // so that it doesn't go negative
            props.onChange(props.value - 1);
        }
    }

    return (
        <div style={styles.numberInput}>
            <IconButton onClick={decrement}>
                <RemoveIcon />
            </IconButton>
            <input
                type="number"
                style={styles.input}
                inputMode="numeric"
                value={props.value}
                min={0}
                onFocus={(e) => e.target.select()}
                onChange={(e) => props.onChange(parseInt(e.target.value))}
            />
            <IconButton onClick={increment}>
                <AddIcon />
            </IconButton>
        </div>
    );
});

export type LabeledValue = {
    label: string;
    value: number;
}

type LabeledCounterProps = {
    label: string;
    value: number;
    placeholderLabel?: string;
    onChange: ({ label, value }: LabeledValue) => void;
};

export default function LabeledCounter(props: LabeledCounterProps) {
    return (
        <div style={{ display: "flex", flexDirection: "row", margin: "8px 0" }}>
            <NumberInput
                onChange={(value: number) => {
                    props.onChange({ label: props.label, value: value })
                }}
                value={props.value}
            />
            <TextField
                id="name"
                label="Item"
                variant="outlined"
                placeholder={props.placeholderLabel}
                value={props.label}
                onChange={(event) => props.onChange({ label: event.target.value, value: props.value })}
            />
        </div>
    );
}


const styles = {
    numberInput: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: "4px",
        marginRight: "8px",
    },
    input: {
        fontSize: "16px",
        height: "90%",
        color: "#24292f",
        background: '#fff',
        border: "1px solid #d0d7de",
        borderRadius: 4,
        margin: "0 4px",
        padding: "10px 8px",
        outline: 0,
        minWidth: 0,
        width: "3rem",
        textAlign: "center" as "center",

        "&:hover": {
            borderColor: "#3399ff",
            color: "red"
        },
        "&:focus": {
            borderColor: "#3399ff",
            boxShadow: "0 0 0 3px #b6daff",
        }
    },
}
