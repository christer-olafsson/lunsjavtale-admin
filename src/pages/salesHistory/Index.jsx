import { ArrowRight, BorderColor, Search, TrendingFlat } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ORDERS, SALES_HISTORIES } from './graphql/query';
import { format } from 'date-fns';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import DataTable from '../../common/datatable/DataTable';
import { SALES_HISTORY_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import useIsMobile from '../../hook/useIsMobile';

const SalesHistory = () => {
  const [salesHistories, setSalesHistories] = useState([])
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const isMobile = useIsMobile()


  const [fetchSalesHistory, { loading, error: salesHistoryErr }] = useLazyQuery(SALES_HISTORIES, {
    fetchPolicy: 'network-only',
    variables: {
      supplierNameEmail: searchText,
      orderStatus: statusFilter === 'all' ? null : statusFilter
    },
    onCompleted: (res) => {
      setSalesHistories(res.salesHistories.edges.map(item => item.node));
    }
  });

  const [salesHistoryDelete, { loading: deleteLoading }] = useMutation(SALES_HISTORY_DELETE, {
    onCompleted: (res) => {
      toast.success(res.salesHistoryDelete.message)
      fetchSalesHistory()
      setSelectedRowIds([])
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleSalesHistoryDelete = () => {
    salesHistoryDelete({
      variables: {
        ids: selectedRowIds,
      }
    })
  }

  const columns = [
    {
      field: 'supplier', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Suppliers</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Link to={`/dashboard/suppliers/details/${params.row.vendor.id}`}>
              <Typography >{params.row.vendor.name}</Typography>
            </Link>
            <Typography sx={{ fontSize: '12px' }}>{params.row.vendor.email}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'products', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Products</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center' gap={2}>
            <Avatar src={params.row.item.attachments.edges.find(item => item.node.isCover)?.node.fileUrl ?? 'noImage.png'} />
            <Stack>
              <Typography>{params.row.item.name}</Typography>
              <Typography sx={{ fontSize: '12px' }}><b>{params.row.priceWithTax} kr</b>  {params.row.item.category.name}</Typography>
            </Stack>
          </Stack>
        )
      }
    },
    {
      field: 'ordered Company', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Ordered Company</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Link to={`/dashboard/customers/details/${params.row.order.company.id}`}>
              <Typography variant='body2'>{params.row.order.company.name}</Typography>
            </Link>
            <Typography sx={{ fontSize: '12px' }}>{params.row.order.company.email}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'orderDate', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{format(params.row.createdOn, 'dd-MM-yyyy')}</Typography>
            <Typography sx={{ fontSize: { xs: '12px', md: '14px' } }}>{format(params.row.createdOn, 'hh:mm a')}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'quentity', width: 100,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Quantity</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.orderedQuantity}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'productsprice', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Products Price</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.totalPriceWithTax} kr</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'commission', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Commission</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row?.vendorCommission}%</Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'green' }}>{params.row.ownerCommission} kr</Typography>
          </Stack>
        )
      }
    },
    // {
    //   field: 'totalPrice', width: 150,
    //   renderHeader: () => (
    //     <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Total Price</Typography>
    //   ),
    //   renderCell: (params) => {
    //     return (
    //       <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
    //         <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.totalPriceWithTax - params.row.ownerCommission} kr</Typography>
    //       </Stack>
    //     )
    //   }
    // },
    {
      field: 'dueAmount', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Due Amount</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: params.row.dueAmount === 0.00 ? 'inherit' : 'coral' }}>{params.row.dueAmount} kr</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'status', headerName: 'Status',
      width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Box sx={{
            display: 'inline-flex',
            padding: '1px 12px',
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
            }[row.order.status],
            color: '#fff',
            borderRadius: '4px',
          }}>
            <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{row.order.status}</Typography>
          </Box>
        )
      }
    },
    {
      field: 'empty', headerName: '',
      width: isMobile ? 50 : undefined,
      flex: isMobile ? undefined : 1,
      renderCell: () => {
        return (
          <Box></Box>
        )
      }
    },


  ];

  useEffect(() => {
    fetchSalesHistory()
  }, [])



  return (
    <Box maxWidth='1600px'>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between'>
        <Stack direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Suppliers Sales History</Typography>
          <Typography sx={{
            fontSize: '12px',
            fontWeight: 600,
            bgcolor: 'light.main',
            borderRadius: '4px',
            color: 'primary.main',
            px: 1
          }}>({salesHistories?.length})</Typography>
        </Stack>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2} alignItems={{ xs: 'start', md: 'center' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '480px',
          bgcolor: '#fff',
          width: '100%',
          border: '1px solid lightgray',
          borderRadius: '4px',
          pl: 2,
        }}>
          <Input onChange={e => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Name / Email' />
          <IconButton><Search /></IconButton>
        </Box>
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
          <CButton
            style={{
              visibility: selectedRowIds.length > 0 ? 'visible' : 'hidden'
            }}
            color='warning'
            isLoading={deleteLoading}
            onClick={handleSalesHistoryDelete}
            variant='contained'>
            Delete
          </CButton>
        </Stack>
      </Stack>
      <Box mt={3}>
        {
          loading ? <Loader /> : salesHistoryErr ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={salesHistories}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => setSelectedRowIds(newSelection)}
              noRowsLabel='No sales history found'
            />
        }
      </Box>
    </Box>
  )
}

export default SalesHistory