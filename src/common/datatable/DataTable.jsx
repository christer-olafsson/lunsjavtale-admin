/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = ({
  noRowsLabel = 'Empty',
  rowHeight = 52,
  loading,
  rows,
  getRowId,
  columns,
  getRowHeight,
  columnVisibilityModel,
  checkboxSelection,
  onRowSelectionModelChange,
}) => {
  return (
    <Box
      maxWidth="1800px"
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <DataGrid
        sx={{
          boxShadow: 2,
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#1E293B',
            color: '#fff',
          },
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
        pagination
        pageSizeOptions={[10, 25, 50, 100]} // Include 10 in pageSizeOptions
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 }, // Set initial pageSize
          },
        }}
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={onRowSelectionModelChange}
        columnVisibilityModel={columnVisibilityModel}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
      />
    </Box>
  );
};

export default DataTable;
