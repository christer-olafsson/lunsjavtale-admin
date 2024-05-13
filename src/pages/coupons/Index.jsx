import { Add, BorderColor, Delete, DeleteForeverOutlined, DeleteOutline, LockOpenOutlined, LockOutlined, ModeEditOutlineOutlined, MoreHoriz, MoreVert, Remove, Search } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';
import NewCoupon from './NewCoupon';
import CDialog from '../../common/dialog/CDialog';
import EditCustomer from './EditCustomer';
import EditCoupon from './EditCoupon';

const rows = [
  { id: '9876sds54', img: '/Table cell.png', title: 'Enjoy 20% Off Your Next Meal', promoCode: 'TASTY20', discount: '20%', freeDelivery: 'No', startDate: '10 Feb, 2023', endDate: '20 Feb , 2023', status: 'active' },
  { id: '9876ds54', img: '/Table cell.png', title: 'Enjoy 20% Off Your Next Meal', promoCode: 'TASTY20', discount: '20%', freeDelivery: 'No', startDate: '10 Feb, 2023', endDate: '20 Feb , 2023', status: 'reject' },
  { id: '98ds7654', img: '/Table cell.png', title: 'Enjoy 20% Off Your Next Meal', promoCode: 'TASTY20', discount: '20%', freeDelivery: 'No', startDate: '10 Feb, 2023', endDate: '20 Feb , 2023', status: 'active' },
];


const Coupons = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [addCouponDialogOpen, setAddCouponDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editCouponDialogOpen, setEditCouponDialogOpen] = useState(false);

  const handleEdit = (row) => {
    setEditCouponDialogOpen(true)
  }

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };


  function handleDelete(row) {
    setDeleteDialogOpen(true)
  }

  const columns = [
    {
      field: 'title', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Title</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Avatar src={params.row.img} sx={{ borderRadius: '4px', width: '80px' }} />
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.title}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'promoCode', width: 150,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Promo Code </Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
            }}>{row.promoCode}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'disount', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Discount</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px' }}>{params.row.discount}</Typography>
        </Stack>
      )
    },
    {
      field: 'freeDelivery', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Free Delivery</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.freeDelivery}</Typography>
        </Stack>
      )
    },
    {
      field: 'startDate', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Start Date</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.startDate}</Typography>
        </Stack>
      )
    },
    {
      field: 'endDate', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>End Date</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.endDate}</Typography>
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
      field: 'edit', headerName: 'Action', width: 70,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
        )
      },
    },
    {
      field: 'delete', headerName: '', width: 150,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteOutline sx={{ color: 'red' }} />
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
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Coupons</Typography>
      <Stack direction={{xs:'column',md:'row'}} gap={2} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
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
        <Button onClick={() => setAddCouponDialogOpen(true)} variant='contained' startIcon={<Add />}>New Coupons</Button>
      </Stack>
      {/* edit coupon */}
      <CDialog openDialog={editCouponDialogOpen}>
        <EditCoupon closeDialog={() => setEditCouponDialogOpen(false)} />
      </CDialog>
      {/* add coupon */}
      <CDialog openDialog={addCouponDialogOpen}>
        <NewCoupon closeDialog={() => setAddCouponDialogOpen(false)} />
      </CDialog>
      {/* delete coupon */}
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
      <Box mt={{xs:10,md:3}}>
        <DataTable
          columns={columns}
          rows={rows}
          columnVisibilityModel={columnVisibilityModel}
        />
      </Box>
    </Box>
  )
}

export default Coupons