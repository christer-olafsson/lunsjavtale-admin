import { NavigateBefore, West } from '@mui/icons-material'
import { Box, Button, IconButton, Rating, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const FoodDetails = () => {
  return (
    <Box>
      <Stack direction='row' alignItems='center' gap={2} mb={2}>
        <Link to='/dashboard/food-item'>
          <IconButton>
            <West />
          </IconButton>
        </Link>
        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Food Details</Typography>
      </Stack>
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
        <Box sx={{
          // flex:1,
          width: { xs: '100%', lg: '457px' },
          height: '560px'
        }}>
          <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src="/food12.png" alt="" />
        </Box>
        <Box sx={{
          // flex:1
        }}>
          <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Vegetable Lasagna with Side Salad</Typography>
          <Stack direction='row' gap={1} mt={2} alignItems='center'>
            <Rating size='small' sx={{ color: 'primary.main' }} value={4} readOnly />
            <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>157 Reviews</Typography>
          </Stack>
          <Typography sx={{ fontSize: { xs: '18px', lg: '24px', fontWeight: 600 }, mt: 2 }}>$200</Typography>
          <Typography sx={{ fontSize: { xs: '14px', lg: '16px', fontWeight: 600 }, mt: 2 }}>Features:</Typography>
          <ul>
            <li>Ordering Options</li>
            <li>Fast and Efficient Delivery/Pickup</li>
            <li>Daily Specials and Promotions</li>
            <li>Healthy and Nutritious Options</li>
            <li>Easy Reordering</li>
            <li>Scheduling and Preordering</li>
            <li>Seating Availability (for Restaurants)</li>
            <li>Integration with Third-Party Platforms</li>
            <li>Feedback and Customer Support</li>
          </ul>
        </Box>
      </Stack>
    </Box>
  )
}

export default FoodDetails