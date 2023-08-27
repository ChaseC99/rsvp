import { IconButton, TextField } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

type GuestListInputProps = {
    guests: string[];
    onChange: (guests: string[]) => void;
}

export default function GuestListInput({ guests, onChange: setGuests }: GuestListInputProps) {
    return (
        <div>
            {guests.map((guest, index) => {
                const isLastGuest = guests.length === index + 1;

                return (
                    <div style={{ margin: "8px 0" }} key={index}>
                        <TextField
                            placeholder={isLastGuest ? "Add a new guest" : "Guest"}
                            variant="standard"
                            fullWidth={isLastGuest}
                            value={guest}
                            onChange={(event) => {
                                const newGuests = [...guests];
                                newGuests[index] = event.currentTarget.value;
                                if (isLastGuest) {
                                    newGuests.push("");
                                };
                                setGuests(newGuests);
                            }}
                        />

                        {
                            !isLastGuest && (
                                <IconButton
                                    aria-label="Remove"
                                    onClick={() => {
                                        const newGuests = [...guests];
                                        newGuests.splice(index, 1);
                                        setGuests(newGuests);
                                    }}
                                    tabIndex={-1}
                                >
                                    <RemoveCircleOutlineIcon color="warning" fontSize="medium" />
                                </IconButton>
                            )
                        }
                    </div>
                )
            })}
        </div>
    )
}