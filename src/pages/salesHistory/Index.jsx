import { BorderColor, ChevronRight, MoreHoriz, Search } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';

const rows = [
  { id: '9843654', customer: 'Atlas Freight', date: 'Feb 09,2024', email: 'deanna.curtis@example.com', location: '6391 Elgin St. Celina, Delaware 10299', total: '200.00', method: 'COD', status: 'Pending', },
  { id: '9876344', customer: 'Atlas Freight', date: 'Feb 09,2024', email: 'deanna.curtis@example.com', location: '6391 Elgin St. Celina, Delaware 10299', total: '200.00', method: 'COD', status: 'Pending', },
  { id: '9437654', customer: 'Atlas Freight', date: 'Feb 09,2024', email: 'deanna.curtis@example.com', location: '6391 Elgin St. Celina, Delaware 10299', total: '200.00', method: 'COD', status: 'Pending', },
];


const SalesHistory = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [statusFilter, setStatusFilter] = useState('');

  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (params) => {
    if (params.row.id === expandedRow) {
      setExpandedRow(null);
    } else {
      setExpandedRow(params.row.id);
    }
  };

  const getRowClassName = (params) => {
    return params.row.id === expandedRow ? 'expanded-row' : '';
  };

  const handleChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const navigate = useNavigate()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  function handleEdit(row) {
    navigate(`/dashboard/orders/edit/${row.id}`)
  }
  function viewDetailsClick(row) {
    navigate(`/dashboard/sales-history/details/${row.id}`)
  }
  const columns = [
    {
      field: 'id', width: 170,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>ID</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, ml: 1 }}>#{params.id}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'customers', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Customers </Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{params.row.customer}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'customerDetails', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.date}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'location', headerName: 'Location', width: 280,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Location</Typography>
      ),
    },
    {
      field: 'amount', headerName: 'Amount', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Total</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'primary.main' }}>${params.row.total}</Typography>
        </Stack>
      )
    },
    {
      field: 'method', headerName: 'Method', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Method</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.method}</Typography>
        </Stack>
      )
    },
    {
      field: 'status', headerName: 'Status', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{
          display: 'inline-flex',
          padding: '4px 12px',
          bgcolor: '#E9EDFF',
          borderRadius: '4px'
        }}>
          <Typography>Pending</Typography>
        </Box>
      ),
    },
    {
      field: 'Action', headerName: 'Action', width: 150,
      renderCell: (params) => {
        return (
          <Button onClick={() => viewDetailsClick(params)}>View Details</Button>
        )
      },
    },
  ];


  // useEffect(() => {
  //   setColumnVisibilityModel({
  //     paymentInfo: isMobile ? false : true,
  //     status: isMobile ? false : true,
  //     deliveryDate: isMobile ? false : true,
  //   })
  // }, [isMobile])

  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Sales History</Typography>
      <Stack direction='row' justifyContent='space-between' mt={3}>
        <Stack direction='row' gap={2}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '480px',
            bgcolor: '#fff',
            width: '100%',
            border: '1px solid lightgray',
            borderRadius: '4px',
            pl: 2
          }}>
            <Input fullWidth disableUnderline placeholder='Search.. ' />
            <IconButton><Search /></IconButton>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value={5}>All </MenuItem>
                <MenuItem value={10}>Complete</MenuItem>
                <MenuItem value={20}>Pending</MenuItem>
                <MenuItem value={30}>Reject</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
        {/* <Box>
          date range
        </Box> */}
      </Stack>
      <Box mt={3}>
        <DataTable
          columns={columns}
          rows={rows}
          columnVisibilityModel={columnVisibilityModel}
        />
      </Box>
    </Box>
  )
}

export default SalesHistory