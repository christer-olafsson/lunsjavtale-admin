import { BorderColor, ChevronRight, MoreHoriz, Search, StoreOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';
import CDialog from '../../common/dialog/CDialog';
import CreatePayment from './CreatePayment';
import { ORDER_PAYMENTS } from './graphql/query';
import { useLazyQuery, useQuery } from '@apollo/client';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import { format } from 'date-fns';

const PaymentsHistory = () => {
  const [orderPayments, setOrderPayments] = useState([])
  const [openCreatePaymentDialog, setOpenCreatePaymentDialog] = useState(false)

  const [fetchOrderPayment, { loading, error }] = useLazyQuery(ORDER_PAYMENTS, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setOrderPayments(res.orderPayments.edges.map(item => item.node));
    }
  });

  const columns = [

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
            <Link to={`/dashboard/customers/details/${params.row.company.id}`}>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 600,
              }}>{params.row.company.name}
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
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{format(params.row.createdOn, 'yyyy-MM-dd')}</Typography>
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
  ];

  useEffect(() => {
    fetchOrderPayment()
  }, [])


  return (
    <Box maxWidth='xxl'>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Payment History</Typography>
        <Button onClick={() => setOpenCreatePaymentDialog(true)} variant='contained'>Create Payment</Button>
      </Stack>
      <CDialog openDialog={openCreatePaymentDialog}>
        <CreatePayment fetchOrderPayment={fetchOrderPayment} closeDialog={() => setOpenCreatePaymentDialog(false)} />
      </CDialog>
      <Box mt={3}>
        {
          loading ? <Loader /> : error ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={orderPayments}
            />
        }
      </Box>
    </Box>
  )
}

export default PaymentsHistory