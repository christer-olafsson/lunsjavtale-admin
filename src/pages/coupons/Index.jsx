import { Add, DeleteOutline, Search } from '@mui/icons-material'
import { Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';
import NewCoupon from './NewCoupon';
import CDialog from '../../common/dialog/CDialog';
import EditCoupon from './EditCoupon';
import { useLazyQuery, useMutation } from '@apollo/client';
import { COUPONS } from './graphql/query';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import { COUPON_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import useIsMobile from '../../hook/useIsMobile';

const Coupons = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [addCouponDialogOpen, setAddCouponDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editCouponDialogOpen, setEditCouponDialogOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [editCouponData, setEditCouponData] = useState({})
  const [deleteCouponData, setDeleteCouponData] = useState({})
  const [searchText, setSearchText] = useState('')

  const isMobile = useIsMobile()


  const [fetchCoupons, { loading: couponsLoading, error: couponsErr }] = useLazyQuery(COUPONS, {
    variables: {
      name: searchText
    },
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setCoupons(res.coupons.edges.map(item => item.node))
    }
  })

  const [couponDelete, { loading: deleteLoading }] = useMutation(COUPON_DELETE, {
    onCompleted: (res) => {
      fetchCoupons()
      toast.success(res.couponDelete.message)
      setDeleteDialogOpen(false)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleEdit = (row) => {
    setEditCouponDialogOpen(true)
    setEditCouponData(row)
  }

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };


  function handleDeleteDialog(row) {
    setDeleteDialogOpen(true)
    setDeleteCouponData(row)
  }

  function handleDelete() {
    couponDelete({
      variables: {
        id: deleteCouponData.id
      }
    })
  }



  const columns = [
    {
      field: 'id', width: 50,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>ID</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Link to={`/dashboard/coupons/details/${row.id}`}>
              <Typography>{row.id}</Typography>
            </Link>
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
              fontSize: '14px',
              fontWeight: 600,
              color: row.isActive ? 'inherit' : 'darkgray'
            }}>{row.name}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'disount', headerName: '', width: 100,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Discount</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', color: params.row.isActive ? 'inherit' : 'darkgray' }}>{params.row.value}%</Typography>
        </Stack>
      )
    },
    {
      field: 'startDate', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Start Date</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', color: params.row.isActive ? 'inherit' : 'darkgray' }}>{format(params.row.startDate,'dd-MM-yyyy')}</Typography>
        </Stack>
      )
    },
    {
      field: 'endDate', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>End Date</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', color: params.row.isActive ? 'inherit' : 'darkgray' }}>{format(params.row.endDate,'dd-MM-yyyy')}</Typography>
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
              color: '#fff',
              bgcolor: row.isActive ? 'primary.main' : 'darkgray',
              px: 1, borderRadius: '8px',
            }}>&#x2022; {row.isActive ? 'Active' : 'Deactive'}</Typography>
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
      field: 'delete', headerName: '',
      width: isMobile ? 150 : undefined,
      flex: isMobile ? undefined : 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteDialog(params.row)}>
            <DeleteOutline fontSize='small' />
          </IconButton>
        )
      },
    },
  ];

  useEffect(() => {
    fetchCoupons()
  }, [])


  return (
    <Box maxWidth='xl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Coupons</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
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
            <Input onChange={e => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Search.. ' />
            <IconButton><Search /></IconButton>
          </Box>
          {/* <Box sx={{ minWidth: 200 }}>
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
          </Box> */}
        </Stack>
        <Button onClick={() => setAddCouponDialogOpen(true)} variant='contained' startIcon={<Add />}>New Coupons</Button>
      </Stack>
      {/* edit coupon */}
      <CDialog openDialog={editCouponDialogOpen}>
        <EditCoupon data={editCouponData} fetchCoupons={fetchCoupons} closeDialog={() => setEditCouponDialogOpen(false)} />
      </CDialog>
      {/* add coupon */}
      <CDialog openDialog={addCouponDialogOpen}>
        <NewCoupon fetchCoupons={fetchCoupons} closeDialog={() => setAddCouponDialogOpen(false)} />
      </CDialog>
      {/* delete coupon */}
      <CDialog closeDialog={() => setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete coupon?</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this coupon? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <Button onClick={() => setDeleteDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
            <CButton onClick={handleDelete} isLoading={deleteLoading} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
          </Stack>
        </Box>
      </CDialog>
      <Box mt={{ xs: 10, md: 3 }}>
        {
          couponsLoading ? <LoadingBar /> : couponsErr ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={coupons}
              columnVisibilityModel={columnVisibilityModel}
            />
        }
      </Box>
    </Box>
  )
}

export default Coupons