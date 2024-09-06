import React, { useContext, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataContext } from '../context/DataContext';
import CarItem from './CarItem';
import { Button, ButtonGroup } from '@mui/material';
import Swal from 'sweetalert2';
function DataTable() {

    const { data, StyledTableCell, handleOpenModal, BASE_URL, setRefresh, refresh, setCachedPages } = useContext(DataContext)
    const [editedItems, setEditedItems] = useState([]);

    const handleItemChange = (item, target, type) => {
        setEditedItems((prevItems) => {
            const itemExists = prevItems.find(prevItem => prevItem.id === item.id);
            if (itemExists) {
                return prevItems.map(prevItem =>
                    prevItem.id === item.id
                        ? { ...prevItem, [type]: target.value, isEdited: 'true' }
                        : prevItem
                );
            } else {
                return [...prevItems, { ...item, [type]: target.value, isEdited: 'true' }];
            }
        });
    };


    // SAVE CHANGES FUNCTION THAT SENDS ONLY UPDATED ITEMS
    const saveChanges = async () => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedItems),
            });

            if (!response.ok) {
                throw new Error('Failed to save changes');
            }

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Changes Saved Successfully",
                showConfirmButton: false,
                timer: 1500
            });
            setEditedItems([])
            setCachedPages({})
            setRefresh(!refresh)
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed To Save Changes",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };


    return (
        <TableContainer component={Paper} sx={{ width: "fit-content", p: 4, textAlign: "center", }}>
            <Table sx={{ display: "flex", minWidth: "fit-content" }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{ display: "flex", flexDirection: "column", width: 140, height: "100%", }}>
                        <StyledTableCell sx={{ height: " 100%" }}>Item Name</StyledTableCell>
                        <StyledTableCell sx={{ height: " 100%" }} align="left">Color</StyledTableCell>
                        <StyledTableCell sx={{ height: " 100%" }} align="left">Model</StyledTableCell>
                        <StyledTableCell sx={{ height: " 100%" }} align="left">Code</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ display: "flex" }}>
                    {data.map((item) => {
                        const editedItem = editedItems.find(edited => edited.id === item.id);
                        return (<CarItem key={item.id} item={editedItem || item} handleItemChange={handleItemChange} />)
                    }
                    )}
                </TableBody>
            </Table>
            <ButtonGroup variant="contained" sx={{ boxShadow: "none" }} aria-label="Basic button group">
                <Button onClick={handleOpenModal} sx={{ mt: 4, marginRight: 2 }} variant="contained">Add Item</Button>
                <Button sx={{ mt: 4 }} variant='contained' color='success' disabled={editedItems.length === 0} onClick={() => saveChanges(editedItems)}>Apply Edits</Button>
            </ButtonGroup >
        </TableContainer >

    )
}

export default DataTable