import React, { useContext, useRef } from 'react'

import { Button, TextField } from '@mui/material';
import { DataContext } from '../context/DataContext';
import Swal from 'sweetalert2';


function CarItem({ item, handleItemChange }) {
    const { StyledTableCell, StyledTableRow, BASE_URL, setData, setCachedPages } = useContext(DataContext);

    // Function To Handle Keyboard Keys
    const colorRef = useRef(null);
    const modelRef = useRef(null);
    const codeRef = useRef(null);
    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            console.log(e, nextRef.current.value)
            nextRef.current.focus();
        } else if (e.key === 'ArrowUp') {
            nextRef.current.focus();
        }
    };


    const handleDeleteItem = async (id) => {
        Swal.fire({
            title: "Are You Sure You want To Delete This Item?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Don't Delete`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${BASE_URL}/${id}`, {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        console.log(`${id} deleted successfully`);
                        setData((prevItems) => prevItems.filter(item => item.id !== id));
                        setCachedPages({})
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Item Deleted Successfully",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else if (response.status === 404) {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Failed To Delete Car",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Failed To Delete Car",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                } catch (error) {
                    console.error('Network error:', error);
                }
            } else if (result.isDenied) {
                Swal.fire("Item Not Deleted", "", "info");
            }
        });

    };

    return (
        <StyledTableRow sx={{ display: 'flex', flexDirection: 'column', margin: "0 4px" }}>
            <StyledTableCell
                sx={{
                    height: 25,
                    width: 160,
                }}
                align="center"
            >
                {item.item_name}
            </StyledTableCell>
            <StyledTableCell align="center">
                <TextField
                    inputRef={colorRef}
                    defaultValue={item.color}
                    variant={item.isEdited === 'true' ? "filled" : "standard"}
                    label={item.isEdited === 'true' && "Edited"}
                    color='blue'
                    onChange={(e) => handleItemChange(item, e.target, 'color')}
                    onKeyDown={(e) => handleKeyDown(e, modelRef)}
                />
            </StyledTableCell>
            <StyledTableCell align="center">
                <TextField
                    inputRef={modelRef}
                    defaultValue={item.model}
                    variant={item.isEdited === 'true' ? "filled" : "standard"}
                    label={item.isEdited === 'true' && "Edited"}
                    onChange={(e) => handleItemChange(item, e.target, 'model')}
                    onKeyDown={(e) => handleKeyDown(e, codeRef)}
                />
            </StyledTableCell>
            <StyledTableCell align="center">
                <TextField
                    inputRef={codeRef}
                    defaultValue={item.code}
                    variant={item.isEdited === 'true' ? "filled" : "standard"}
                    label={item.isEdited === 'true' && "Edited"}
                    onChange={(e) => handleItemChange(item, e.target, 'code')}
                    onKeyDown={(e) => handleKeyDown(e, colorRef)}
                />
            </StyledTableCell>
            <Button onClick={() => handleDeleteItem(item.id)} variant='contained' color='error'>Delete Item</Button>
        </StyledTableRow>
    );

}

export default CarItem;