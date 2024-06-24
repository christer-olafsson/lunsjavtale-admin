/* eslint-disable react/prop-types */
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'

const DataTable = ({ rows,getRowId, columns, getRowHeight, columnVisibilityModel }) => {
  return (
    <Box
      sx={{
        height: '650px',
        width: '100%',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={getRowHeight}
        getRowId={getRowId}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 10,
        //     },
        //   },
        // }}
        // pageSizeOptions={[10]}
        columnVisibilityModel={columnVisibilityModel}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
      />
    </Box>
  )
}

export default DataTable