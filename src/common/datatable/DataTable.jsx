/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'

const DataTable = ({ rows,getRowId, rowHeight,columns, getRowHeight, columnVisibilityModel,checkboxSelection,onRowSelectionModelChange }) => {
  return (
    <Box
      sx={{
        minHeight: '650px',
        width: '100%',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
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