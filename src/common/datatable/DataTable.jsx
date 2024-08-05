/* eslint-disable react/prop-types */
import { Box, styled } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'


const DataTable = ({ loading, rows, getRowId, rowHeight, columns, getRowHeight, columnVisibilityModel, checkboxSelection, onRowSelectionModelChange }) => {
  return (
    <Box
      maxWidth='1800px'
      sx={{
        width: '100%',
      }}
    >
      <DataGrid
        // sx={{
        //   boxShadow: 2,
        //   minHeight: '650px',
        // }}
        sx={{
          boxShadow: 2,
          minHeight: '650px',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#1E293B',
            color: '#fff'
          },
        }}
        localeText={{
          noRowsLabel: 'Empty',
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} Selected`
              : `${count.toLocaleString()} Selected`,
        }}
        loading={loading}
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