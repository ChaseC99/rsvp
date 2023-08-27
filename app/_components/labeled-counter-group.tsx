import { Button } from "@mui/material";
import LabeledCounter, { LabeledValue } from "./labeled-counter";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type LabeledCounterGroupProps = {
    labels: LabeledValue[];
    onChange: (labels: LabeledValue[]) => void;
}

export default function LabeledCounterGroup({ labels, onChange }: LabeledCounterGroupProps) {
    const handleChange = (index: number, { label, value }: LabeledValue) => {
        const newLabels = [...labels];
        newLabels[index] = { label, value };
        onChange(newLabels);
    }

    return (
        <div>
            {labels.map(({ label, value }, index) => (
                <LabeledCounter
                    key={index}
                    label={label}
                    value={value}
                    onChange={({ label, value }) => handleChange(index, { label, value })}
                />
            )
            )}

            <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                fullWidth
                onClick={() => onChange([...labels, { label: "", value: 1 }])}
            >
                Add a new item
            </Button>
        </div>
    );
}