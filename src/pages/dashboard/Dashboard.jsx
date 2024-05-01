/* eslint-disable react/prop-types */
import { ArrowUpward } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'
import React from 'react';

const TotalBox = ({ item }) => {
  return (
    <Box sx={{
      width: '100%',
      border: '1px solid lightgray',
      p: 2, borderRadius: '8px'
    }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>{item.title}</Typography>
      <Stack direction='row' justifyContent='space-between' alignItems='center' gap={2}>
        {item.price && <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>${item.price}</Typography>}
        {item.orders && <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>{item.orders}</Typography>}
        {item.customers && <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>{item.customers}</Typography>}
        
        <Box sx={{
          display: 'inline-flex',
          alignItems: 'center',
          color: item.percent > 15 ? 'primary.main' : 'red'
        }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 400, }}>+{item.percent}%</Typography>
          <ArrowUpward sx={{ 
            fontSize: '14px', 
            transform: item.percent > 15 ? 'none' : 'rotate(180deg)'
            }} />
        </Box>
      </Stack>
    </Box>
  )
};

const totalBoxData = [
  { title: 'Today"s Sale', price: '12,426', percent: '36' },
  { title: 'Total Sale', price: '2,38864', percent: '15' },
  { title: 'Total Orders', orders: '382', percent: '36' },
  { title: 'Total Customers', customers: '57', percent: '43' },
]


const Dashboard = () => {
  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Welcome , Lunsjavtale</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' gap={2} mt={3}>
        {
          totalBoxData.map((item, id) => (
            <TotalBox key={id} item={item} />
          ))
        }
      </Stack>
    </Box>
  )
}

export default Dashboard