import { useState } from "react";
import { IconButton, TextField } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

type ListInputProps = {
    placeholder: string;
    items: string[];
    onChange: (items: string[]) => void;
}

export default function ListInput({ placeholder, items, onChange }: ListInputProps) {
    // Create a deep copy of the items array, so that changes aren't made to event page state
    const [itemsList, setItemsList] = useState([...items]);

    // Add an empty item input at the end so that the "Add a new {placeholder}" input is always visible
    if (itemsList.length === 0 || itemsList[itemsList.length - 1] !== "") {
        setItemsList([...itemsList, ""]);
    }

    const handleNewItems = (newItems: string[]) => {
        // Send the new items, excluding the last one, which is the empty input
        onChange(newItems.slice(0, -1));

        // Update the itemsList state, including the empty input
        setItemsList(newItems);
    }

    return (
        <div>
            {itemsList.map((item, index) => {
                const isLastItem = itemsList.length === index + 1;

                return (
                    <div style={{ margin: "8px 0" }} key={index}>
                        <TextField
                            placeholder={isLastItem ? `Add a new ${placeholder.toLowerCase()}` : placeholder}
                            variant="standard"
                            style={{width: isLastItem ? "100%" : "calc(100% - 40px)"}}
                            value={item}
                            onChange={(event) => {
                                const newItems = [...itemsList];
                                newItems[index] = event.currentTarget.value;
                                if (isLastItem) {
                                    newItems.push("");
                                };
                                handleNewItems(newItems);
                            }}
                        />

                        {
                            !isLastItem && (
                                <IconButton
                                    aria-label="Remove"
                                    onClick={() => {
                                        const newItems = [...itemsList];
                                        newItems.splice(index, 1);
                                        handleNewItems(newItems);
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