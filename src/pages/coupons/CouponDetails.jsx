import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { COUPON } from './graphql/query'
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { format } from 'date-fns'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'

const CouponDetails = () => {
  const [coupon, setCoupon] = useState({})

  const { id } = useParams()
  const navigate = useNavigate()

  const { loading, error } = useQuery(COUPON, {
    variables: {
      id
    },
    onCompleted: (res) => {
      setCoupon(res.coupon)
    }
  });
  console.log(coupon)
  return (
    <Box maxWidth='xl'>
      <Stack direction='row' gap={2}>
        <IconButton onClick={() => navigate(- 1)}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Coupon Details</Typography>
      </Stack>
      <Box mt={3}>
        <Stack alignItems='center' sx={{
          mb: 2,
          display: 'inline-flex',
          padding: '5px 12px',
          bgcolor: coupon?.isActive ? 'green' : 'lightgray',
          color: '#fff',
          borderRadius: '50px',
          minWidth: '200px',
        }}>
          <Typography sx={{ fontWeight: 600 }} variant='body2'>{coupon?.isActive ? 'Active' : 'Deactivated'}</Typography>
        </Stack>
        {
          coupon.isDeleted &&
          <Stack alignItems='center' sx={{
            mb: 2,
            display: 'inline-flex',
            padding: '5px 12px',
            bgcolor: 'red',
            color: '#fff',
            borderRadius: '50px',
            minWidth: '200px',
          }}>
            <Typography sx={{ fontWeight: 600 }} variant='body2'>Deleted</Typography>
          </Stack>
        }
        <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 0, md: 6 }}>
          <Stack direction='row' gap={2}>
            <Stack alignItems='flex-end' gap={1}>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Coupon Code: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Created On:</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Start Date: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>End Date: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Promo Type: </Typography>
            </Stack>
            <Stack gap={1}>
              <Typography sx={{ whiteSpace: 'nowrap', bgcolor: 'coral', px: 1, borderRadius: '4px', color: '#fff', textAlign: 'center' }}><b>{coupon?.name}</b></Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>{coupon?.createdOn && <b>{format(coupon?.createdOn, 'dd-MM-yyyy')}</b>}</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>{coupon?.startDate && <b>{format(coupon?.startDate, 'dd-MM-yyyy')}</b>}</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>{coupon?.endDate && <b>{format(coupon?.endDate, 'dd-MM-yyyy')}</b>}</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{coupon?.promoType}</b></Typography>
            </Stack>
          </Stack>
          <Stack direction='row' gap={2}>
            <Stack alignItems='flex-end' gap={1}>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Discount Value: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Max Amount: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Min Amount: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Max Limit Per User: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Max Uses Limit: </Typography>
            </Stack>
            <Stack gap={1}>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{coupon?.value}</b> %</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{coupon?.maxAmount}</b></Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{coupon?.minAmount}</b></Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{coupon?.maxLimitPerUser}</b></Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{coupon?.maxUsesLimit}</b></Typography>
            </Stack>
          </Stack>
        </Stack>
        <Divider sx={{ my: 3 }} />

        <Stack gap={2}>
          <Typography variant='h5'>Added For</Typography>
          {
            loading ? <Loader /> : error ? <ErrorMsg /> :
              coupon?.addedFor?.edges.map(item => (
                <Stack sx={{
                  border: '1px solid lightgray',
                  p: 2,
                  maxWidth: '300px',
                  borderRadius: '8px'
                }} direction='row' gap={1} key={item.node.id}>
                  <Avatar src={item.node.logoUrl} />
                  <Box>
                    <Link to={`/dashboard/customers/details/${item.node.id}`}>{item.node.name}</Link>
                    <Typography>{item.node.email}</Typography>
                  </Box>
                </Stack>
              ))
          }
        </Stack>
      </Box >
    </Box >
  )
}

export default CouponDetails