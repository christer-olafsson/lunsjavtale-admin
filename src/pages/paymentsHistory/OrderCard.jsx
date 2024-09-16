/* eslint-disable react/prop-types */
import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import { KeyboardDoubleArrowRightOutlined } from '@mui/icons-material';

const OrderCard = ({ item }) => {

  const data = item.node;
  console.log(data)
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
          <Typography sx={{ whiteSpace: 'nowrap' }}>Order ID: #<b>{data.id}</b></Typography>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Delivery:<b>{data.deliveryDate}</b></Typography>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Due Amount:<b>{data.dueAmount}</b></Typography>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Total Price:<b>{data.finalPrice}</b></Typography>
        </Box>
        <Box>
          <Typography mb={1} sx={{
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
                      : data.status === 'Payment-completed'
                        ? 'Green'
                        : 'yellow',
            color: data.status === 'Placed'
              ? 'dark' : data.status === 'Payment-pending'
                ? 'dark' : data.status === 'Confirmed' ? 'dark' :
                  data.status === 'Payment-completed' ? '#fff' : data.status === 'Updated' ? 'dark' : '#fff',
          }}><b>{data.status}</b></Typography>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Payment Type:<b>{data?.paymentType === 'online' ? 'Vipps' : data?.paymentType}</b></Typography>
          {data.coupon && <Typography sx={{ whiteSpace: 'nowrap' }}>Coupon:<b style={{ backgroundColor: 'coral', color: '#fff', paddingLeft: '5px', paddingRight: '5px' }}>{data.coupon?.name}</b></Typography>}
          {data.note && <Typography sx={{ whiteSpace: 'nowrap' }}>Note:<b>{data.note}</b></Typography>}

        </Box>
      </Stack >



    </Box >
  )
}

export default OrderCard