import { Search, StoreOutlined } from '@mui/icons-material'
import { Avatar, Box, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';
import { ORDER_PAYMENTS } from './graphql/query';
import { useLazyQuery, useMutation } from '@apollo/client';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import { format } from 'date-fns';
import { PAYMENT_HISTORY_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import useIsMobile from '../../hook/useIsMobile';

const PaymentsHistory = () => {
  const [orderPayments, setOrderPayments] = useState([])
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const isMobile = useIsMobile()

  const [fetchOrderPayment, { loading, error }] = useLazyQuery(ORDER_PAYMENTS, {
    variables: {
      companyNameEmail: searchText,
      status: statusFilter === 'all' ? null : statusFilter
    },
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setOrderPayments(res.orderPayments.edges.map(item => item.node));
    }
  });

  const [paymentHistoryDelete, { loading: deleteLoading }] = useMutation(PAYMENT_HISTORY_DELETE, {
    onCompleted: (res) => {
      toast.success(res.paymentHistoryDelete.message)
      fetchOrderPayment()
      setSelectedRowIds([])
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handlePaymentHistoryDelete = () => {
    paymentHistoryDelete({
      variables: {
        ids: selectedRowIds
      }
    })
  }

  const columns = [
    {
      field: 'id', headerName: '', width: 50,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>ID</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
          <Link to={`/dashboard/payments-history/details/${params.row.id}`}>{params.row.id}</Link>
        </Stack>
      )
    },
    {
      field: 'company', headerName: '', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Company</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
          {params.row.logoUrl ? <Avatar sx={{ borderRadius: '4px' }} src={params.row.logoUrl} /> :
            <StoreOutlined />}
          <Box>
            <Link to={params.row.company.isDeleted ? '' : `/dashboard/customers/details/${params.row.company.id}`}>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: params.row.company.isDeleted ? 'red' : 'inherit'
              }}>{params.row.company.isDeleted && '(removed)'}{params.row.company.name}
              </Typography>
            </Link>
            <Typography sx={{ fontSize: '14px' }}>{params.row.company.email}</Typography>
          </Box >
        </Stack >
      )
    },
    {
      field: 'paymentType', headerName: 'Prce', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Payment Type</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, bgcolor: 'lightgray', px: 2, borderRadius: '4px' }}>
            {params.row.paymentType}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'createdDate', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Created On</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{format(params.row.createdOn, 'dd-MM-yyyy')}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'paidAmount', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Paid Amount</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', color: '#fff', fontWeight: 600, bgcolor: 'green', px: 2, borderRadius: '4px' }}>
            <span style={{ fontWeight: 400, }}>kr </span>
            {params.row.paidAmount}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'status', headerName: '',
      width: isMobile ? 200 : undefined,
      flex: isMobile ? undefined : 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontWeight: 600 }}>
            {params.row.status}
          </Typography>
        </Stack>
      )
    },
  ];

  useEffect(() => {
    fetchOrderPayment()
  }, [])

  return (
    <Box maxWidth='xl'>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between'>
        <Stack direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Payment History</Typography>
          <Typography sx={{
            fontSize: '12px',
            fontWeight: 600,
            bgcolor: 'light.main',
            borderRadius: '4px',
            color: 'primary.main',
            px: 1
          }}>({orderPayments?.length})</Typography>
        </Stack>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2} alignItems={{ xs: 'start', md: 'center' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: { xs: '100%', md: '300px' },
          bgcolor: '#fff',
          width: '100%',
          border: '1px solid lightgray',
          borderRadius: '4px',
          pl: 2
        }}>
          <Input onChange={(e) => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Name / Email' />
          <IconButton><Search /></IconButton>
        </Box>
        <Stack direction='row' gap={2}>
          <Box sx={{ minWidth: 200 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value={'all'}>All</MenuItem>
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'completed'}>Completed</MenuItem>
                <MenuItem value={'cancelled'}>Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <CButton
            style={{
              visibility: selectedRowIds.length > 0 ? 'visible' : 'hidden'
            }}
            isLoading={deleteLoading}
            color='warning'
            onClick={handlePaymentHistoryDelete}
            variant='contained'>
            Delete
          </CButton>
        </Stack>
      </Stack>
      <Box mt={3}>
        {
          loading ? <Loader /> : error ? <ErrorMsg /> :
            <DataTable
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => setSelectedRowIds(newSelection)}
              columns={columns}
              rows={orderPayments}
            />
        }
      </Box>
    </Box>
  )
}

export default PaymentsHistory