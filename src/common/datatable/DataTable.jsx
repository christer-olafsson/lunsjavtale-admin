/* eslint-disable react/prop-types */
import { Box, styled } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'


const DataTable = ({ rows, getRowId, rowHeight, columns, getRowHeight, columnVisibilityModel, checkboxSelection, onRowSelectionModelChange }) => {
  return (
    <Box
      maxWidth='xl'
      sx={{
        minHeight: '650px',
        width: '100%',
      }}
    >
      <DataGrid
        sx={{
          boxShadow: 2
        }}
        rows={rows}
        columns={columns}
        autoHeight
        rowHeight={rowHeight}
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