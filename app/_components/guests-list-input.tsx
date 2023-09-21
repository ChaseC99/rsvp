import { IconButton, TextField } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

type GuestListInputProps = {
    guests: string[];
    onChange: (guests: string[]) => void;
}

export default function GuestListInput({ guests, onChange: setGuests }: GuestListInputProps) {
    // Create a deep copy of the guests array, so that changes aren't made to event page state
    const guestsList: string[] = [...guests];

    // Add an empty guest input at the end so that the "Add a new guest" input is always visible
    if (guestsList.length === 0 || guestsList[guestsList.length - 1] !== "") {
        guestsList.push("");
    }

    return (
        <div>
            {guestsList.map((guest, index) => {
                const isLastGuest = guestsList.length === index + 1;

                return (
                    <div style={{ margin: "8px 0" }} key={index}>
                        <TextField
                            placeholder={isLastGuest ? "Add a new guest" : "Guest"}
                            variant="standard"
                            style={{width: isLastGuest ? "100%" : "calc(100% - 40px)"}}
                            value={guest}
                            onChange={(event) => {
                                const newGuests = [...guestsList];
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
                                        const newGuests = [...guestsList];
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