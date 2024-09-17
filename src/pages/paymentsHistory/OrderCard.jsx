/* eslint-disable react/prop-types */
import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react'

const OrderCard = ({ item }) => {

  const data = item.node;

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
          <Typography mb={1}>Status: <b> {data.status}</b></Typography>
          <Typography sx={{ whiteSpace: 'nowrap' }}>Payment Type:<b>{data?.paymentType === 'online' ? 'Vipps' : data?.paymentType}</b></Typography>
          {data.coupon && <Typography sx={{ whiteSpace: 'nowrap' }}>Coupon:<b style={{ backgroundColor: 'coral', color: '#fff', paddingLeft: '5px', paddingRight: '5px' }}>{data.coupon?.name}</b></Typography>}
          {data.note && <Typography sx={{ whiteSpace: 'nowrap' }}>Note:<b>{data.note}</b></Typography>}
        </Box>
      </Stack >

      <Typography variant='h6' my={4}>Order Carts</Typography>

      <Stack gap={3}>
        {
          !data?.orderCarts?.edges ? <Typography>No cart Found!</Typography> :
            data?.orderCarts?.edges.map(item => (
              <Stack key={item.node.id} sx={{
                border: '1px solid lightgray',
                maxWidth: '800px',
                borderRadius: '8px',
                p: 1
              }} direction={{ xs: 'column', md: 'row' }} gap={{ xs: 0, md: 2 }} alignItems={{ xs: 'start', md: 'center' }} justifyContent='space-between'>
                <Stack direction={{ xs: 'row', md: 'row' }} gap={{ xs: 0, md: 1 }} alignItems='center'>
                  <img style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    margin: '10px',
                    border: '1px solid lightgray'
                  }} src={item?.node.item.attachments?.edges.find(item => item.node.isCover)?.node.fileUrl ?? "/noImage.png"} alt="" />
                  <Box mb={{ xs: 0, md: 2 }}>
                    <Typography sx={{ fontSize: { xs: '14', md: '18px' }, fontWeight: 600 }}>{item?.node.item.name}</Typography>
                    <Typography variant='body2'>Category: <b>{item?.node.item.category.name}</b></Typography>
                    <Typography>Price: <b>{item?.node.item.priceWithTax}</b> kr</Typography>
                  </Box>
                </Stack>
              </Stack>
            ))
        }
      </Stack>

    </Box >
  )
}

export default OrderCard