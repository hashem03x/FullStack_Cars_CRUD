import { useContext } from "react";
import { Pagination, Stack } from "@mui/material";
import DataTable from "./components/DataTable";
import AddItemModal from "./components/AddItemModal";
import { DataContext } from "./context/DataContext";
import Loading from "./components/Loading";
function App() {
  const { data, paginationData, handlePagination, openModal, setOpenModal } = useContext(DataContext)


  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ textAlign: "center" }}>Cars Table</h2>
      {data.length > 0 ? (
        <>
          <DataTable data={data} />
          <Stack sx={{ marginTop: 10 }} spacing={2}>
            <Pagination count={paginationData.totalPages} onChange={handlePagination} color="secondary" />
          </Stack>
        </>) : (<Loading />)}

      {openModal && <AddItemModal openModal={openModal} setOpenModal={setOpenModal} />}
    </main>

  );
}


export default App;
