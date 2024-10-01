/* eslint-disable react/prop-types */
import { Box, styled } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'


const DataTable = ({ noRowsLabel = 'Empty', rowHeight = 52, loading, rows, getRowId, columns, getRowHeight, columnVisibilityModel, checkboxSelection, onRowSelectionModelChange }) => {
  return (
    <Box
      maxWidth='1800px'
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <DataGrid
        sx={{
          boxShadow: 2,
          // minHeight: '650px',
          // '& .MuiDataGrid-columnHeader': {
          //   backgroundColor: '#1E293B',
          //   color: '#fff'
          // },
        }}
        localeText={{
          noRowsLabel,
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} Selected`
              : `${count.toLocaleString()} Selected`,
        }}
        loading={loading}
        rows={rows}
        columns={columns}
        rowHeight={rowHeight}
        autoHeight
        getRowHeight={getRowHeight}
        getRowId={getRowId}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={onRowSelectionModelChange}
        columnVisibilityModel={columnVisibilityModel}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
      />
    </Box>
  )
}

export default DataTable








/* eslint-disable react/prop-types */
// import { Box, Pagination, PaginationItem, useTheme } from '@mui/material';
// import { DataGrid, useGridApiContext, useGridSelector, gridPageSelector, gridPageCountSelector } from '@mui/x-data-grid';

// function CustomPagination() {
//   const apiRef = useGridApiContext();
//   const page = useGridSelector(apiRef, gridPageSelector);
//   const pageCount = useGridSelector(apiRef, gridPageCountSelector);

//   return (
//     <Pagination
//       color="primary"
//       variant="contained"
//       // shape="rounded"
//       page={page + 1}
//       count={pageCount}
//       renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
//       onChange={(event, value) => apiRef.current.setPage(value - 1)}
//     />
//   );
// }

// const DataTable = ({
//   rows,
//   columns,
//   rowHeight = 52,
//   getRowHeight,
//   checkboxSelection = false,
//   onRowSelectionModelChange,
//   columnVisibilityModel,
//   pageSize = 10,
//   pageSizeOptions = [10, 25, 50],
//   noRowsLabel = 'No data available',
//   sx,
// }) => {

//   return (
//     <Box
//       sx={{ width: { xs: '96vw', md: '100%' } }}
//     >
//       <DataGrid
//         sx={{ bgcolor: '#fff', }}
//         rows={rows}
//         columns={columns}
//         autoHeight
//         rowHeight={rowHeight}
//         getRowHeight={getRowHeight}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize,
//             },
//           },
//         }}
//         localeText={{
//           noRowsLabel,
//           footerRowSelected: (count) =>
//             `${count.toLocaleString()} Selected`,
//         }}
//         checkboxSelection={checkboxSelection}
//         onRowSelectionModelChange={onRowSelectionModelChange}
//         columnVisibilityModel={columnVisibilityModel}
//         pageSizeOptions={pageSizeOptions}
//         disableRowSelectionOnClick
//         disableColumnFilter
//         disableColumnSorting
//         disableColumnMenu
//         slots={{
//           pagination: CustomPagination,
//         }}
//       />
//     </Box>
//   );
// };

// export default DataTable;
