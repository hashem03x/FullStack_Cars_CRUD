import { createContext, useEffect, useState } from "react";
import { styled } from '@mui/material';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';


export const DataContext = createContext()


function Dataprovider({ children }) {

    // GLOBAL VARIABLES
    const BASE_URL = "http://localhost:5000/cars"
    // GLOBAL VARIABLES

    // USE STATES
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [refresh, setRefresh] = useState(true)
    const [cachedPages, setCachedPages] = useState({})
    const [paginationData, setPaginationData] = useState({})
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);

    // USE STATES

    // HANDLE FUNCTIONS
    const handlePagination = (e, value) => {
        setCurrentPage(value)
    }
    // HANDLE FUNCTIONS


    // COMMON MUI STYLES 
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    }));
    // COMMON MUI STYLES 

    // USE EFFECTS
    useEffect(() => {
        const fetchData = async () => {
            if (cachedPages[currentPage]) {
                setData(cachedPages[currentPage]);
            } else {
                try {
                    const response = await fetch(`${BASE_URL}?page=${currentPage}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const result = await response.json();
                    setData(result.data)
                    setCachedPages({ ...cachedPages, [currentPage]: result.data });
                    setPaginationData(result.pagination)
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            }
        };
        fetchData()
    }, [currentPage, cachedPages, refresh])
    // USE EFFECTS


    return (
        <DataContext.Provider value={{ setData, data, currentPage, paginationData, setPaginationData, handlePagination, setRefresh, refresh, BASE_URL, StyledTableCell, StyledTableRow, openModal, setOpenModal, handleOpenModal, setCachedPages }}>
            {children}
        </DataContext.Provider>
    )
}

export default Dataprovider