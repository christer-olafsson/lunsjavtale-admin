import { AccessTime, AccessTimeOutlined, ArrowRight, BorderColor, CalendarMonthOutlined, DeleteOutline, EditOutlined, Search, TrendingFlat } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteOrderDialogOpen, setDeleteOrderDialogOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 0

  const handlePaginationChange = (newPage) => {
    console.log(newPage)
    setSearchParams({ page: newPage.page })
  }

  const isMobile = useIsMobile()


  const { loading, error: orderErr } = useQuery(ORDERS, {
    variables: {
      companyNameEmail: searchText,
      status: statusFilter === 'all' ? '' : statusFilter
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      setOrders(res.orders.edges.map(item => item.node));
    }
  });

  const [orderHistoryDelete, { loading: deleteLoading }] = useMutation(ORDER_HISTORY_DELETE, {
    refetchQueries: [ORDERS],
    onCompleted: (res) => {
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

    const now = moment().tz("Europe/Oslo");
    const future = moment.tz(futureDate, "UTC").tz("Europe/Oslo");

    const diffInMilliseconds = future.diff(now);

    if (diffInMilliseconds < 0) {
      return "Date has passed";
    }

    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const remainingMilliseconds = diffInMilliseconds % (1000 * 60 * 60 * 24);
    const diffInHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));

    if (diffInDays === 0 && diffInHours === 0) {
      return "Delivery today";
    } else if (diffInDays === 0) {
      return `Delivery in ${diffInHours}h`;
    } else {
      return `Delivery in ${diffInDays}Days ${diffInHours}h`;
    }
  }



  // function timeUntilNorway(futureDate, mode = "") {
  //   if (mode === "Delivered") {
  //     return "Delivered";
  //   }
  //   if (mode === "Cancelled") {
  //     return "Cancelled";
  //   }

  //   const now = moment().tz("Europe/Oslo").startOf('day');
  //   const future = moment.tz(futureDate, "UTC").tz("Europe/Oslo").startOf('day');

  //   const diffInMilliseconds = future.diff(now);
  //   if (diffInMilliseconds < 0) {
  //     return 'Date passed!';
  //   }

  //   const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  //   if (diffInDays === 0) {
  //     return 'Delivery Today';
  //   } else {
  //     return `Delivery in ${diffInDays} days`;
  //   }
  // }

  const columns = [
    {
      field: 'id', headerName: '', width: 80,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>ID</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Link className='link' to={`/dashboard/orders/details/${params.row.id}`}>
            <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, color: 'blue' }}>&#x2022; {params.row.id}</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      field: 'company', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Company</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center' gap={1}>
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
      field: 'Order Date', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{ display: 'inline-flex', }}>
              {format(params.row.createdOn, 'dd-MM-yyyy')}
            </Typography>
            <Typography sx={{ fontSize: '14px', display: 'inline-flex' }}>
              {format(params.row?.createdOn, 'hh:mm a')}
            </Typography>
          </Stack>
        )
      }
    },
    {
      field: 'Delivery Date', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Delivery Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{ fontWeight: 600, display: 'inline-flex', }}>
              {/* <CalendarMonthOutlined fontSize='small' /> */}
              {format(params.row.deliveryDate, 'dd-MM-yyyy')}
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'green', display: 'inline-flex' }}>
              {/* <AccessTime sx={{ mr: .5 }} fontSize='small' /> */}
              {format(params.row?.deliveryDate, 'hh:mm a')}
            </Typography>
          </Stack>
        )
      }
    },
    {
      field: 'totalPrice', headerName: '', width: 120,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Total Price</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} justifyContent='center'>
          <Typography sx={{ color: 'blue', fontWeight: 600 }}>
            {params.row.finalPrice}
            <span style={{ fontWeight: 300 }}> kr</span>
          </Typography>
          {
            params.row.discountAmount > 0 &&
            <Typography sx={{ fontSize: '14px', color: 'red', fontWeight: 600 }}>
              -{params.row.discountAmount}
              <span style={{ fontWeight: 400 }}> kr</span>
            </Typography>
          }
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

    {
      field: 'status', headerName: 'Status', width: 230,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: 5 }}>Status</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        const isNew = ['Placed', 'Updated', 'Payment-pending', 'Payment-completed'].includes(row.status);
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center' gap={.5}>
            <Stack alignItems='center' direction='row' gap={.5}>
              <Box sx={{
                display: 'inline-flex',
                padding: '2px 12px',
                bgcolor: {
                  Placed: '#6251DA',
                  Updated: '#6251DA',
                  Confirmed: '#433878',
                  Processing: '#B17457',
                  Delivered: 'green',
                  'Payment-completed': '#00695c',
                  'Ready-to-deliver': '#283593',
                  'Payment-pending': '#c2185b',
                  Cancelled: 'red',
                }[row.status],
                color: '#FFF',
                borderRadius: '4px',
              }}>
                <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: '13px' }} >
                  {row.status}
                </Typography>
              </Box>
              {isNew &&
                <Typography sx={{ color: 'purple', fontSize: '14px', fontWeight: 600 }} variant='body2'>new</Typography>
              }
            </Stack>
            <Typography variant='body2' sx={{ fontWeight: 500, display: 'inline-flex' }}>
              <AccessTimeOutlined sx={{ mr: .5 }} fontSize='small' />
              {timeUntilNorway(params.row.deliveryDate, params.row.status)}
            </Typography>
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
      field: 'delete', headerName: '', width: isMobile ? 200 : undefined,
      flex: isMobile ? undefined : 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteDialog(params.row)}>
            <DeleteOutline fontSize='small' />
          </IconButton>
        )
      },
    },
    // {
    //   field: 'timeUntil', headerName: '',
    //   width: isMobile ? 400 : undefined,
    //   flex: isMobile ? undefined : 1,
    //   renderCell: (params) => (
    //     <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
    //       <Typography variant='body2' sx={{ fontWeight: 500, display: 'inline-flex' }}>
    //         <AccessTimeOutlined sx={{ mr: .5 }} fontSize='small' />
    //         {timeUntilNorway(params.row.deliveryDate, params.row.status)}
    //       </Typography>
    //     </Stack>
    //   )
    // },
  ];


  return (
    <Box maxWidth='xl'>
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
                <MenuItem value={'Updated'}>Updated</MenuItem>
                <MenuItem value={'Confirmed'}>Confirmed</MenuItem>
                <MenuItem value={'Processing'}>Processing</MenuItem>
                <MenuItem value={'Ready-to-deliver'}>Ready to Deliver</MenuItem>
                <MenuItem value={'Delivered'}>Delivered</MenuItem>
                <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
                <MenuItem value={'Payment-pending'}>Payment-Pending</MenuItem>
                <MenuItem value={'Payment-completed'}>Payment-Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

        </Stack>

      </Stack>

      {/* update order */}
      <CDialog openDialog={orderUpdateDialogOpen}>
        <UpdateOrder data={orderUpdateData} closeDialog={() => setOrderUpdateDialogOpen(false)} />
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
              noRowsLabel='No orders found'
            />
        }
      </Box>
    </Box>
  )
}

export default Orders