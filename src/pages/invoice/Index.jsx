import { Add, DeleteOutline, Search } from '@mui/icons-material'
import { Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useState } from 'react';
import DataTable from '../../common/datatable/DataTable';
import NewInvoice from './NewInvoice';
import CDialog from '../../common/dialog/CDialog';
import EditInvoice from './EditInvoice';
import { Link } from 'react-router-dom';

const rows = [
  { id: '98734', invoiceId: '3232', date: '6 April 2023', customerName: 'Big Kahuna Burger Ltd.', totalPayment: '3243.12', duePayment: '556', status: 'pending' },
  { id: '98754', invoiceId: '3232', date: '6 April 2023', customerName: 'Big Kahuna Burger Ltd.', totalPayment: '3243.12', duePayment: '556', status: 'pending' },
  { id: '98654', invoiceId: '3232', date: '6 April 2023', customerName: 'Big Kahuna Burger Ltd.', totalPayment: '3243.12', duePayment: '556', status: 'pending' },
];


const Invoice = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [addIinvoiceDialogOpen, setAddInvoiceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editInvoiceDialogOpen, setEditInvoiceDialogOpen] = useState(false);

  const handleEdit = (row) => {
    setEditInvoiceDialogOpen(true)
  }

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };


  function handleDelete(row) {
    setDeleteDialogOpen(true)
  }

  const columns = [
    {
      field: 'title', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Invoice ID</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Link to='/dashboard/invoice/details/23'>
              <Typography sx={{ fontSize: '14px' }}>#{params.row.invoiceId}</Typography>
            </Link>
          </Stack>
        )
      }
    },
    {
      field: 'date', width: 150,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Date </Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
            }}>{row.date}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'customerName', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Customer Name</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.customerName}</Typography>
        </Stack>
      )
    },
    {
      field: 'totalPayment', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Total Payment</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>${params.row.totalPayment}</Typography>
        </Stack>
      )
    },
    {
      field: 'duePayment', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Due Payment</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>${params.row.duePayment}</Typography>
        </Stack>
      )
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
              color: row.status === 'reject' ? 'red' : 'primary.main ',
              bgcolor: 'light.main',
              px: 1, borderRadius: '8px',
            }}>&#x2022; {row.status}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'delete', headerName: 'Action', width: 70,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteOutline />
          </IconButton>
        )
      },
    },
    {
      field: 'edit', headerName: '', width: 70,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
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
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Invoice </Typography>
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
                <MenuItem value={30}>Reject </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
        <Button onClick={() => setAddInvoiceDialogOpen(true)} variant='contained' startIcon={<Add />}>New Invoice</Button>
      </Stack>
      {/* edit invoice */}
      <CDialog openDialog={editInvoiceDialogOpen}>
        <EditInvoice closeDialog={() => setEditInvoiceDialogOpen(false)} />
      </CDialog>
      {/* add invoice */}
      <CDialog openDialog={addIinvoiceDialogOpen}>
        <NewInvoice closeDialog={() => setAddInvoiceDialogOpen(false)} />
      </CDialog>
      {/* delete invoice */}
      <CDialog closeDialog={() => setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete coupon?</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this coupon? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <Button onClick={() => setDeleteDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
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

export default Invoice