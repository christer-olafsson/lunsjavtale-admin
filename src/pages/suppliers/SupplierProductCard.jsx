/* eslint-disable react/prop-types */
import { ArrowRightAlt } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SlideDrawer from '../foodMenu/SlideDrawer'
import FoodDetails from '../foodMenu/FoodDetails'

const SupplierProductCard = ({ data }) => {
  const [openSlideDrawer, setOpenSlideDrawer] = useState(false);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpenSlideDrawer(!openSlideDrawer);
  };
  return (
    <Box sx={{
      width: { xs: '100%', md: '300px' },
      bgcolor: data.availability ? 'light.main' : '#fff',
      p: { xs: 1, lg: 2.5 },
      borderRadius: '8px',
      border: '1px solid lightgray',
      opacity: data.availability ? '1' : '.6'
    }}>
      <img style={{ width: '100%', height: '138px', objectFit: 'cover', borderRadius: '4px' }}
        src={data?.attachments.edges.find(item => item.node.isCover)?.node?.fileUrl || '/noImage.png'} alt="" />
      <Stack>
        <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>{data?.name}</Typography>
        <Stack direction='row' alignItems='center' gap={2}>
          <Typography
            sx={{
              fontSize: '12px',
              bgcolor: data.availability ? 'primary.main' : 'darkgray',
              color: '#fff',
              px: 1, borderRadius: '4px',
            }}>
            {data.availability ? 'Available' : 'Not Available'}
          </Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{data.category?.name ? data.category?.name : 'Uncategorised'}</Typography>
        </Stack>
        {/* <Stack direction='row' alignItems='center' gap={1}>
          <Rating value={4} size='small' sx={{ color: 'primary.main' }} readOnly />
          <Typography sx={{ fontSize: '12px' }}>86 Rating</Typography>
          <span>|</span>
          <Typography sx={{ fontSize: '12px' }}>43 Delivery</Typography>
        </Stack> */}
        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={1} mt={1}>
          <Typography sx={{ fontSize: '16px' }}><i style={{ fontWeight: 600 }}>kr </i> {data.priceWithTax}
            <i style={{ fontWeight: 400, fontSize: '13px' }}> (tax)</i> </Typography>
          <Typography sx={{ fontSize: { xs: '14px', lg: '14px', color: '#848995' } }}><i style={{ fontWeight: 600 }}>kr </i>{data.actualPrice} </Typography>
        </Stack>
      </Stack>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mt={1}>
        {/* <Button variant='outlined' onClick={() => handleProductEditDialogOpen(id)} sx={{ bgcolor: '#fff', whiteSpace: 'nowrap' }}>Edit Now</Button> */}
        <Button onClick={toggleDrawer} endIcon={<ArrowRightAlt />}>Details</Button>
      </Stack>
      {/* food details page */}
      <SlideDrawer openSlideDrawer={openSlideDrawer} toggleDrawer={toggleDrawer}>
        <FoodDetails data={data} toggleDrawer={toggleDrawer} />
      </SlideDrawer>
    </Box>
  )
}

export default SupplierProductCard