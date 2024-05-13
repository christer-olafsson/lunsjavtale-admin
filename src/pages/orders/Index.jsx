import { BorderColor, MoreHoriz, Search } from '@mui/icons-material'
import { Avatar, Box, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';

const rows = [
  { orderDate: 'Feb 09,24', id: '987654', customerName: 'Atlas Freight', email: 'deanna.curtis@example.com', location: '6391 Elgin St. Celina, Delaware 10299', amount: '200.00', status: 'On Delivery', },
  { orderDate: 'Feb 09,24', id: '987654', customerName: 'Atlas Freight', email: 'deanna.curtis@example.com', location: '6391 Elgin St. Celina, Delaware 10299', amount: '200.00', status: 'On Delivery', },
  { orderDate: 'Feb 09,24', id: '987654', customerName: 'Atlas Freight', email: 'deanna.curtis@example.com', location: '6391 Elgin St. Celina, Delaware 10299', amount: '200.00', status: 'On Delivery', },
];


const Orders = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [filter, setFilter] = useState('');

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  const navigate = useNavigate()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  function handleEdit(row) {
    navigate(`/dashboard/orders/edit/${row.id}`)
  }
  function OrderIdClick(row) {
    navigate(`/dashboard/orders/details/${row.id}`)
  }
  const columns = [
    {
      field: 'id', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order ID</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{
            cursor: 'pointer',
            color: 'blue'
          }} onClick={() => OrderIdClick(params.row)} direction='row' alignItems='center'>
            <Box>#</Box>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{params.id}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'orderDate', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Date </Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{params.row.orderDate}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'customerDetails', width: 350,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Customer Details</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Avatar />
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.customerName}</Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{params.row.email}</Typography>
            </Box>
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
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Amount</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'primary.main' }}>${params.row.amount}</Typography>
        </Stack>
      )
    },
    {
      field: 'status', headerName: 'Status', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status Order</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{
          display: 'inline-flex',
          padding: '4px 12px',
          bgcolor: '#E9EDFF',
          borderRadius: '4px'
        }}>
          <Typography>New Order</Typography>
        </Box>
      ),
    },
    // {
    //   field: 'details', headerName: '', width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton sx={{
    //         borderRadius: '5px',
    //         width: { xs: '30px', md: '40px' },
    //         height: { xs: '30px', md: '40px' },
    //       }} onClick={() => handleEdit(params.row)}>
    //         <MoreHoriz fontSize='small' />
    //       </IconButton>
    //     )
    //   },
    // },
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
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Order History</Typography>
      <Stack direction={{xs:'column-reverse',md:'row'}} gap={2} justifyContent='space-between' mt={3}>
        <Box sx={{ minWidth: 200 }}>
          <FormControl size='small' fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={handleChange}
            >
              <MenuItem value={10}>On Delivery</MenuItem>
              <MenuItem value={20}>New Order</MenuItem>
              <MenuItem value={30}>Delivered</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
          <Input fullWidth disableUnderline placeholder='Search Order Id' />
          <IconButton><Search /></IconButton>
        </Box>
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

export default Orders