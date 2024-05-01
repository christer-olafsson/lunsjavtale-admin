import { Add, BorderColor, DeleteForeverOutlined, LockOpenOutlined, LockOutlined, ModeEditOutlineOutlined, MoreHoriz, Remove, Search } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';
import AddCustomer from './AddCustomer';
import CDialog from '../../common/dialog/CDialog';
import EditCustomer from './EditCustomer';

const rows = [
  { id: '987654', customerName: 'Atlas Freight', email: 'deanna.curtis@example.com', status: 'Active', company: 'Brekke-Willms ' },
  { id: '987324', customerName: 'Atlas Freight', email: 'deanna.curtis@example.com', status: 'lock', company: 'Brekke-Willms ' },
];


const Customers = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
  const [editCustomerDialogOpen, setEditCustomerDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  function handleEdit(row) {
    setEditCustomerDialogOpen(true)
  }
  function handleDelete(row) {
    setDeleteDialogOpen(true)
  }
 
  const columns = [
    {
      field: 'customerDetails', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Customer Name</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Avatar />
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.customerName}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'status', width: 150,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status </Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
              fontSize: { xs: '12px', md: '16px' },
              color: row.status === 'lock' ? 'red' : 'primary.main ',
              bgcolor: 'light.main',
              px: 1, borderRadius: '8px',
            }}>&#x2022; {row.status}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'companyName', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Company Name</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px' }}>{params.row.company}</Typography>
        </Stack>
      )
    },
    {
      field: 'email', headerName: '', width: 350,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Email Address</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.email}</Typography>
        </Stack>
      )
    },
    {
      field: 'delete', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton onClick={()=> setDeleteDialogOpen(true)} sx={{
            borderRadius: '5px',
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
          }}>
            <DeleteForeverOutlined />
          </IconButton>
        )
      },
    },
    {
      field: 'lock', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton sx={{
            borderRadius: '5px',
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
          }}>
            <LockOutlined sx={{
              color: params.row.status === 'lock' ? 'red' : 'gray'
            }} />
          </IconButton>
        )
      },
    },
    {
      field: 'edit', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton sx={{
            borderRadius: '5px',
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
          }} onClick={() => handleEdit(params.row)}>
            <ModeEditOutlineOutlined />
          </IconButton>
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
      <Stack direction='row' gap={1} alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Customers</Typography>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'primary.main', bgcolor: 'light.main', borderRadius: '4px', px: 1 }}>3 users</Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
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
                onChange={handleStatusFilterChange}
              >
                <MenuItem value={5}>All </MenuItem>
                <MenuItem value={10}>New</MenuItem>
                <MenuItem value={20}>Active</MenuItem>
                <MenuItem value={30}>Locked</MenuItem>
                <MenuItem value={30}>Deleted</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
        <Button onClick={() => setAddCustomerDialogOpen(true)} variant='contained' startIcon={<Add />}>New Customer</Button>
      </Stack>
      {/* edit customer */}
      <CDialog openDialog={editCustomerDialogOpen}>
        <EditCustomer closeDialog={() => setEditCustomerDialogOpen(false)} />
      </CDialog>
      {/* add customer */}
      <CDialog openDialog={addCustomerDialogOpen}>
        <AddCustomer closeDialog={() => setAddCustomerDialogOpen(false)} />
      </CDialog>
      {/* delete customer */}
      <CDialog closeDialog={()=> setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{fontSize:{xs:'18px',lg:'22px'},fontWeight:600}}>Delete company</Typography>
          <Typography sx={{fontSize:'14px',mt:1}}>Are you sure you want to delete this company? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <Button onClick={()=> setDeleteDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
            <Button fullWidth variant='contained' color='error'>Delete</Button>
          </Stack>
        </Box>
      </CDialog>
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

export default Customers