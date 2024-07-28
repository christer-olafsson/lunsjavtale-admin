/* eslint-disable react/prop-types */
import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import { KeyboardDoubleArrowRightOutlined } from '@mui/icons-material';

const OrderCard = ({ item }) => {
  
  const data = item.node;
  const orderCarts = item.node.orderCarts.edges.map(item => item.node);
  const billingAddress = item.node.billingAddress;
  const shippingAddress = item.node.shippingAddress;
  return (
    <Box sx={{
      maxWidth: '700px',
      boxShadow: 2,
      border: '1px solid lightgray',
      p: 2, borderRadius: '8px'
    }}>
      <Stack sx={{ width: '100%' }} direction='row' gap={2} justifyContent='space-between' >
        <Box>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Delivery:<b>{data.deliveryDate}</b></Typography>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Due Amount:<b>{data.dueAmount}</b></Typography>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Total Price:<b>{data.finalPrice}</b></Typography>
        </Box>
        <Box>
          <Typography sx={{
            whiteSpace: 'nowrap',
            px: 1, borderRadius: '4px',
            width: 'fit-content',
            bgcolor: data.status === 'Cancelled'
              ? 'red'
              : data.status === 'Confirmed'
                ? 'lightgreen'
                : data.status === 'Delivered'
                  ? 'green'
                  : data.status === 'Processing'
                    ? '#8294C4'
                    : data.status === 'Ready-to-deliver'
                      ? '#01B8A9'
                      : 'yellow',
            color: data.status === 'Placed'
              ? 'dark' : data.status === 'Payment-pending'
                ? 'dark' : data.status === 'Confirmed' ? 'dark' : '#fff',
          }}>Status:<b>{data.status}</b></Typography>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Payment Type:<b>{data.paymentType}</b></Typography>
          {data.coupon && <Typography sx={{ whiteSpace: 'nowrap' }}>Coupon:<b style={{ backgroundColor: 'coral', color: '#fff', paddingLeft: '5px', paddingRight: '5px' }}>{data.coupon?.name}</b></Typography>}
          {data.note && <Typography sx={{ whiteSpace: 'nowrap' }}>Note:<b>{data.note}</b></Typography>}

        </Box>
      </Stack>
      <Stack gap={2} mt={2}>
        <Typography variant='h5'>Order Carts:</Typography>
        {
          orderCarts?.map(data => (
            <Box sx={{
              border: '1px solid lightgray',
              maxWidth: '800px',
              borderRadius: '8px',
              p: 1
            }} key={data.id}>
              <Typography>{data.date}</Typography>
              <Typography>Quantity: {data.orderedQuantity}</Typography>
              <Typography>Total Price (tax): {data.totalPriceWithTax}</Typography>
              <Typography>Due: {data.dueAmount} kr</Typography>
              {data.cancelled !== 0 &&
                <Typography>Cancelled: {data.cancelled}</Typography>
              }
              {data.vendor &&
                <Typography>Vendor:
                  <Link to={`/dashboard/suppliers/details/${data.vendor.id}`}>
                    {data.vendor.name}
                  </Link>
                </Typography>
              }
              <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 0, md: 2 }} alignItems={{ xs: 'start', md: 'center' }} justifyContent='space-between'>
                <Stack direction={{ xs: 'row', md: 'row' }} gap={{ xs: 0, md: 1 }} alignItems='center'>
                  <img style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    margin: '10px',
                    border: '1px solid lightgray'
                  }} src={data?.item?.attachments?.edges?.find(item => item.node.isCover)?.node.fileUrl ?? "/noImage.png"} alt="" />
                  <Box mb={{ xs: 0, md: 2 }}>
                    <Typography sx={{ fontSize: { xs: '14', md: '18px' }, fontWeight: 600 }}>{data?.item?.name}</Typography>
                    <Typography variant='body2'>Category: <b>{data?.item?.category?.name}</b></Typography>
                    <Typography>Price: <b>{data?.item?.priceWithTax}</b> kr</Typography>
                  </Box>
                </Stack>
                {/* <Stack gap={.5} mr={2}>
                <Typography>Quantity: <b>{data?.node.orderedQuantity}</b> </Typography>
                <Typography>Total Price: <b>{data?.node.totalPriceWithTax}</b> kr</Typography>
              </Stack> */}
              </Stack>
            </Box>
          ))
        }
      </Stack>


    </Box>
  )
}

export default OrderCard