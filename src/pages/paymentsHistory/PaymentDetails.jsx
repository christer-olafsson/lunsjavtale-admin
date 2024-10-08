import { useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ORDER_PAYMENT } from './graphql/query';
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import { format } from 'date-fns';
import OrderCard from './OrderCard';

const PaymentDetails = () => {
  const [payment, setPayment] = useState({})

  const { id } = useParams()
  const navigate = useNavigate()

  const { loading, error } = useQuery(ORDER_PAYMENT, {
    variables: {
      id
    },
    onCompleted: (res) => {
      setPayment(res.orderPayment)
    }
  });
  return (
    <Box maxWidth='xl'>

      <Stack direction='row' gap={2}>
        <IconButton onClick={() => navigate(- 1)}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Payment Details</Typography>
      </Stack>
      <Box mt={3}>
        <Stack direction='row' gap={2}>
          <Stack alignItems='center' sx={{
            mb: 2,
            display: 'inline-flex',
            padding: '5px 12px',
            border: '1px solid lightgray',
            borderRadius: '50px',
            minWidth: '200px',
          }}>
            <Typography sx={{ fontWeight: 600 }} variant='body2'>Payment: {payment?.status}</Typography>
          </Stack>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' gap={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={3}>
            <Stack direction='row' gap={2}>
              <Stack alignItems='flex-end' gap={1}>
                <Typography sx={{ whiteSpace: 'nowrap' }}>Created On:</Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}>Payment Type: </Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}>Paid Amount: </Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}>Note: </Typography>
              </Stack>
              <Stack gap={1}>
                {
                  payment?.createdOn &&
                  <Typography sx={{ whiteSpace: 'nowrap' }}>
                    <b>{format(payment?.createdOn, 'dd-MM-yyyy')}</b>
                    <span style={{ fontSize: '12px', paddingLeft: '5px' }}>{format(payment?.createdOn, 'hh:mm a')}</span>
                  </Typography>
                }
                <Typography sx={{ whiteSpace: 'nowrap' }}><b>{payment?.paymentType === 'online' ? 'Vipps' : payment?.paymentType}</b></Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}> <b>{payment?.paidAmount}</b> kr</Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}> {payment?.note}</Typography>
              </Stack>
            </Stack>
            {
              payment?.paymentFor &&
              <Stack>
                <Typography fontWeight={600}>Payment For</Typography>
                <Typography sx={{ width: 'fit-content', border: '1px solid coral', borderRadius: '4px', px: 1, color: 'coral' }}><b>{payment.paymentFor?.role}</b></Typography>
                <Typography>User Name:
                  <Link to={`/dashboard/customers/staff/details/${payment?.paymentFor?.id}`}>
                    <b>{payment.paymentFor?.username}</b>
                  </Link>
                </Typography>
                <Typography>Name: <b>{payment.paymentFor?.firstName + ' ' + payment.paymentFor?.lastName}</b></Typography>
                <Typography>Email: <b>{payment.paymentFor?.email}</b></Typography>
              </Stack>
            }
          </Stack>
          <Stack sx={{
            px: 3
          }} gap={2}>
            <Typography variant='h5'>Customer Information</Typography>
            <Stack direction='row' gap={1}>
              <Avatar src={payment?.company?.logoUrl ?? '/noImage.png'} />
              <Box>
                <Typography sx={{ fontSize: '16px' }}>Name: <b>
                  <Link to={`/dashboard/customers/details/${payment?.company?.id}`}>{payment?.company?.name}</Link>
                </b></Typography>
                <Typography sx={{ fontSize: '16px' }}>Email: <b>{payment?.company?.email}</b></Typography>
                <Typography sx={{ fontSize: '16px' }}>Contact: <b>{payment?.company?.contact}</b></Typography>
                <Typography sx={{ fontSize: '16px' }}>PostCode: <b>{payment?.company?.postCode}</b></Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Divider sx={{ mt: 3 }} />

        <Stack gap={3} mt={3}>
          <Typography variant='h5'>Orders</Typography>
          {
            loading ? <LoadingBar /> : error ? <ErrorMsg /> :
              payment?.orders?.edges.length === 0 ? <Typography>No Order Found!</Typography> :
                payment?.orders?.edges.map(data => {
                  return (
                    <OrderCard key={data.node.id} item={data} />
                  )
                })
          }
        </Stack>

      </Box >
    </Box >
  )
}

export default PaymentDetails