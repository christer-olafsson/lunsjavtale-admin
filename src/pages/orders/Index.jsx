import { AccessTimeOutlined, ArrowRight, BorderColor, DeleteOutline, EditOutlined, Search, TrendingFlat } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ORDERS } from './graphql/query';
import { format } from 'date-fns';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import DataTable from '../../common/datatable/DataTable';
import CDialog from '../../common/dialog/CDialog';
import UpdateOrder from './UpdateOrder';
import ApplyCoupon from './ApplyCoupon';
import CButton from '../../common/CButton/CButton';
import toast from 'react-hot-toast';
import { ORDER_HISTORY_DELETE } from './graphql/mutation';
import moment from 'moment-timezone';
import CreatePayment from './CreatePayment';
import useIsMobile from '../../hook/useIsMobile';

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [orderUpdateDialogOpen, setOrderUpdateDialogOpen] = useState(false)
  const [orderUpdateData, setOrderUpdateData] = useState({})
  const [searchText, setSearchText] = useState('')
  const [searchOrderId, setSearchOrderId] = useState('')
  const [statusFilter, setStatusFilter] = useState('');
  const [couponRowData, setCouponRowData] = useState({})
  const [couponDialogOpen, setCouponDialogOpen] = useState(false)
  const [deleteOrderDialogOpen, setDeleteOrderDialogOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState('')

  const isMobile = useIsMobile()


  const [fetchOrders, { loading, error: orderErr }] = useLazyQuery(ORDERS, {
    variables: {
      companyNameEmail: searchText,
      status: statusFilter === 'all' ? '' : statusFilter
    },
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setOrders(res.orders.edges.map(item => item.node));
    }
  });

  const [orderHistoryDelete, { loading: deleteLoading }] = useMutation(ORDER_HISTORY_DELETE, {
    refetchQueries: [ORDERS],
    onCompleted: (res) => {
      fetchOrders()
      toast.success(res.orderHistoryDelete.message)
      setDeleteOrderDialogOpen(false)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });


  function handleEdit(row) {
    setOrderUpdateDialogOpen(true)
    setOrderUpdateData(row)
  }

  function handleCoupon(row) {
    setCouponRowData(row)
    setCouponDialogOpen(true)
  }

  function handleDeleteDialog(row) {
    setDeleteOrderDialogOpen(true)
    setDeleteOrderId(row.id)
  }

  function handleOrderDelete() {
    orderHistoryDelete({
      variables: {
        id: deleteOrderId
      }
    })
  }

  function timeUntilNorway(futureDate, mode = "") {
    if (mode === "Delivered") {
      return "Delivered";
    }
    if (mode === "Cancelled") {
      return "Cancelled";
    }

    const now = moment().tz("Europe/Oslo").startOf('day');
    const future = moment.tz(futureDate, "UTC").tz("Europe/Oslo").startOf('day');

    const diffInMilliseconds = future.diff(now);
    if (diffInMilliseconds < 0) {
      return 'Date passed!';
    }

    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Delivery Today';
    } else {
      return `Delivery in ${diffInDays} days`;
    }
  }

  const columns = [
    {
      field: 'id', headerName: '', width: 100,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>ID</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Link to={`/dashboard/orders/details/${params.row.id}`}>
            <Typography sx={{ fontSize: { xs: '14px', md: '16px' } }}>&#x2022; {params.row.id}</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      field: 'company', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Company</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center' gap={2}>
            <Avatar src={row.company.logoUrl ?? ''} />
            <Box>
              <Link to={params.row.company.isDeleted ? '' : `/dashboard/customers/details/${row.company.id}`}>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: row.company.isDeleted ? 'red' : 'inherit'
                }}>{row.company.isDeleted && '(removed)'} {row.company.name}
                </Typography>
              </Link>
              <Typography>{row.company?.email}</Typography>
            </Box>
          </Stack>
        )
      }
    },
    {
      field: 'Date', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}> Order: <b>{format(params.row.createdOn, 'dd-MM-yyyy')}</b>
              <span style={{ fontSize: '13px', marginLeft: '5px' }}>{format(params.row?.createdOn, 'HH:mm')}</span>
            </Typography>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}> Delivery: <b>{format(params.row.deliveryDate, 'dd-MM-yyyy')}</b> </Typography>
          </Stack>
        )
      }
    },
    {
      field: 'totalPrice', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Total Price</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            <span style={{ fontWeight: 400 }}>kr </span>
            {params.row.finalPrice}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'amount', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Amount</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} justifyContent='center'>
          {
            params.row.paidAmount > 0 &&
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, color: params.row.paidAmount > 0 ? 'green' : 'lightgray' }}>
              Paid: <b>{params.row.paidAmount}</b>
              <span style={{ fontWeight: 400, marginLeft: '5px' }}>kr </span>
            </Typography>
          }
          {
            params.row.dueAmount > 0 &&
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, color: params.row.dueAmount > 0 ? 'coral' : 'lightgray' }}>
              due: <b>{params.row.dueAmount}</b>
              <span style={{ fontWeight: 400, marginLeft: '5px' }}>kr </span>
            </Typography>
          }
        </Stack>
      )
    },
    // {
    //   field: 'dueAmount', headerName: '', width: 150,
    //   renderHeader: () => (
    //     <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Due Amount</Typography>
    //   ),
    //   renderCell: (params) => (
    //     <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
    //       <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
    //         <span style={{ fontWeight: 400 }}>kr </span>
    //         {params.row.dueAmount}
    //       </Typography>
    //     </Stack>
    //   )
    // },
    {
      field: 'status', headerName: 'Status', width: 220,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: 5 }}>Status</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} alignItems='center' direction='row' gap={.5}>
            <Box sx={{
              ml: 5,
              display: 'inline-flex',
              padding: '5px 12px',
              bgcolor: row.status === 'Cancelled'
                ? 'red'
                : row.status === 'Confirmed'
                  ? 'lightgreen'
                  : row.status === 'Delivered'
                    ? 'green'
                    : row.status === 'Processing'
                      ? '#8294C4'
                      : row.status === 'Payment-completed'
                        ? 'blue'
                        : row.status === 'Ready-to-deliver'
                          ? '#01B8A9'
                          : 'yellow',
              color: row.status === 'Placed'
                ? 'dark' : row.status === 'Payment-pending'
                  ? 'dark' : row.status === 'Confirmed' ? 'dark' : row.status === 'Updated' ? 'dark' : '#fff',
              borderRadius: '4px',
            }}>
              <Typography sx={{ fontWeight: 600, textAlign: 'center' }} variant='body2'>{row.status}</Typography>
            </Box>
            {row.status === 'Placed' &&
              <Typography sx={{ color: 'green' }} variant='body2'>new</Typography>
            }
          </Stack>
        )
      }
    },

    {
      field: 'action', headerName: '', width: 70,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Action</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <IconButton
            disabled={
              row.status === 'Cancelled'
              || row.status === 'Delivered'
              || row.company.isDeleted
            }
            sx={{
              bgcolor: 'light.main',
              borderRadius: '5px',
              width: { xs: '30px', md: '40px' },
              height: { xs: '30px', md: '40px' },
            }} onClick={() => handleEdit(params.row)}>
            <EditOutlined fontSize='small' />
          </IconButton>
        )
      },
    },
    {
      field: 'delete', headerName: '', width: 60,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteDialog(params.row)}>
            <DeleteOutline fontSize='small' />
          </IconButton>
        )
      },
    },
    {
      field: 'Coupon', headerName: 'Action', width: 100,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Coupon</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            {
              row.coupon ?
                <Typography variant='body2' sx={{
                  fontWeight: 600,
                  bgcolor: 'coral',
                  color: '#fff',
                  borderRadius: '4px',
                  px: 1,
                  width: 'fit-content'
                }}>{row.coupon.name}</Typography> :
                <Button
                  sx={{ width: 'fit-content' }}
                  disabled={
                    row.status === 'Cancelled'
                    || row.status === 'Delivered'
                    || row.coupon !== null
                    || row.company.isDeleted
                  }
                  onClick={() => handleCoupon(params.row)}>
                  Apply
                </Button>
            }
          </Stack>
        )
      },
    },
    {
      field: 'timeUntil', headerName: '',
      width: isMobile ? 200 : undefined,
      flex: isMobile ? undefined : 1,
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography variant='body2' sx={{ fontWeight: 500, display: 'inline-flex' }}>
            <AccessTimeOutlined sx={{ mr: .5 }} fontSize='small' />
            {timeUntilNorway(params.row.deliveryDate, params.row.status)}
          </Typography>
        </Stack>
      )
    },
  ];

  useEffect(() => {
    fetchOrders()
  }, [])


  return (
    <Box maxWidth='1600px'>
      <Stack sx={{ mb: 2 }} direction='row' alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Order History</Typography>
        <Typography sx={{
          fontSize: '12px',
          fontWeight: 600,
          bgcolor: 'light.main',
          borderRadius: '4px',
          color: 'primary.main',
          px: 1
        }}>({orders?.length})</Typography>
      </Stack>
      <Stack direction={{ xs: 'column-reverse', md: 'row' }} justifyContent='space-between'>
        <Stack direction='row' gap={2}>
          <Box sx={{ minWidth: { xs: 150, md: 200 } }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value={'all'}>All </MenuItem>
                <MenuItem value={'Placed'}>Placed</MenuItem>
                <MenuItem value={'Confirmed'}>Confirmed</MenuItem>
                <MenuItem value={'Delivered'}>Delivered</MenuItem>
                <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
                <MenuItem value={'Payment-pending'}>Payment-Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '300px',
            bgcolor: '#fff',
            width: '100%',
            height: 'fit-content',
            border: '1px solid lightgray',
            borderRadius: '4px',
            pl: 2
          }}>
            <Input onChange={(e) => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='ID / Name / Email' />
            <IconButton><Search /></IconButton>
          </Box>

        </Stack>

      </Stack>
      {/* apply coupon */}
      <CDialog openDialog={couponDialogOpen}>
        <ApplyCoupon fetchOrders={fetchOrders} data={couponRowData} closeDialog={() => setCouponDialogOpen(false)} />
      </CDialog>
      {/* update order */}
      <CDialog openDialog={orderUpdateDialogOpen}>
        <UpdateOrder fetchOrders={fetchOrders} data={orderUpdateData} closeDialog={() => setOrderUpdateDialogOpen(false)} />
      </CDialog>
      {/* delete Order */}
      <CDialog closeDialog={() => setDeleteOrderDialogOpen(false)} maxWidth='sm' openDialog={deleteOrderDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Confirm Delete ?</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this order history? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <CButton onClick={() => setDeleteOrderDialogOpen(false)} style={{ width: '100%' }} variant='outlined'>Cancel</CButton>
            <CButton isLoading={deleteLoading} onClick={handleOrderDelete} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
          </Stack>
        </Box>
      </CDialog>
      <Box mt={3}>
        {
          loading ? <Loader /> : orderErr ? <ErrorMsg /> :
            <DataTable
              rowHeight={80}
              columns={columns}
              rows={orders}
            />
        }
      </Box>
    </Box>
  )
}

export default Orders