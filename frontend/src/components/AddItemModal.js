import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import { useContext, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import Swal from 'sweetalert2'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
};

export default function AddItemModal({ setOpenModal, openModal }) {
    const handleClose = () => setOpenModal(false);
    const itemNameRef = useRef()
    const itemColorRef = useRef()
    const itemModelRef = useRef()
    const itemCodeRef = useRef()

    const { BASE_URL, setCachedPages } = useContext(DataContext)

    const handleAddItem = async () => {
        if (itemNameRef.current.value === "" || itemColorRef.current.value === "" || itemModelRef.current.value === "" || itemCodeRef.current.value === "") {
            return
        }
        try {
            const response = await fetch(BASE_URL, {
                method: "POST", headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    item_name: itemNameRef.current.value, color: itemColorRef.current.value, model: itemModelRef.current.value, code: itemCodeRef.current.value
                })
            })
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json()
            console.log(data)
            setCachedPages({})
            handleClose()
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "New Car Added Successfully",
                showConfirmButton: false,
                timer: 1500
            });
        } catch {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed To Add New Car",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }


    return (
        <div>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center', gap: 4 }}>
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Add New Item
                        </Typography>
                        <TextField inputRef={itemNameRef} id="outlined-basic" label="Item Name" variant="outlined" />
                        <TextField inputRef={itemColorRef} id="outlined-basic" label="Color" variant="outlined" />
                        <TextField inputRef={itemModelRef} id="outlined-basic" label="Model" variant="outlined" />
                        <TextField inputRef={itemCodeRef} id="outlined-basic" label="Code" variant="outlined" />
                        <Button onClick={handleAddItem} variant='contained'> + Add Item</Button>
                    </Box>
                </Box>
            </Modal>
        </div >
    );
}
