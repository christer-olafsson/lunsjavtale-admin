/* eslint-disable react/prop-types */
import { ArrowRightAlt, Bookmark, ErrorOutline } from '@mui/icons-material'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CDialog from '../../common/dialog/CDialog'
import EditItem from './EditItem'
import SlideDrawer from './SlideDrawer'
import FoodDetails from './FoodDetails'

const FoodCard = ({ data, fetchCategory, fetchProducts }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
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
      // bgcolor: data.node.availability ? 'light.main' : '#fff',
      p: { xs: 1, lg: 2.5 },
      borderRadius: '8px',
      border: data.node.vendor ? '1px solid coral' : '1px solid lightgray',
      boxShadow: data.node.availability ? 2 : 0,
      position: 'relative'
    }}>
      {
        data.node.isFeatured &&
        <Tooltip title='Featured Product'>
          <Bookmark color='primary' sx={{
            position: 'absolute',
            top: 5, right: 5
          }} />
        </Tooltip>
      }
      {
        !data.node.availability &&
        <ErrorOutline sx={{
          position: 'absolute',
          color: 'coral',
          fontSize: '3rem',
          zIndex: 2,
        }} />
      }
      <Stack sx={{ height: '100%' }} justifyContent='space-between'>
        <Stack gap={.5}>
          <Box sx={{
            width: '100%',
            height: '138px',
            boxShadow: 3
          }}>
            <img style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px',
              opacity: data.node.availability ? '1' : '.6',
            }}
              src={data?.node.attachments.edges.find(item => item.node.isCover)?.node.fileUrl || '/noImage.png'} alt="no img"
            />
          </Box>
          <Typography sx={{ fontSize: '14px', fontWeight: '600', mt: 1 }}>
            {data?.node.name.substring(0, 60)}
            {data?.node.name.length > 60 ? '...' : ''}
          </Typography>
          <Stack direction='row' alignItems='center' gap={.5} flexWrap='wrap'>
            <Typography
              sx={{
                fontSize: '12px',
                bgcolor: data.node.availability ? 'green' : 'darkgray',
                color: '#fff',
                px: 1, borderRadius: '4px',
              }}>
              {data?.node.availability ? 'Available' : 'Not Available'}
            </Typography>
            {
              data?.node.weeklyVariants.edges.length > 0 &&
              data?.node.weeklyVariants.edges.map((item, id) => (
                <Typography
                  key={id}
                  sx={{
                    fontSize: '12px',
                    bgcolor: 'Highlight',
                    color: '#fff',
                    px: 1, borderRadius: '4px',
                  }}>
                  {item.node.name}
                </Typography>
              ))
            }
            {
              data?.node?.vendor !== null &&
              <Typography
                sx={{
                  fontSize: '12px',
                  bgcolor: 'coral',
                  color: '#fff',
                  px: 1, borderRadius: '4px',
                }}>
                Supplier
              </Typography>
            }
          </Stack>
          {
            data.node?.vendor &&
            <Stack direction='row' gap={.5}>
              <Link
                style={{ fontSize: '14px', textDecoration: 'none' }}
                to={`/dashboard/suppliers/details/${data.node?.vendor.id}`}>
                {data.node?.vendor?.name}
              </Link>
              {data.node?.vendor?.isDeleted && <i style={{ color: 'coral' }}>(deleted)</i>}
            </Stack>
          }
          <Stack direction='row' gap={2}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>id: #
              <Link style={{ textDecoration: 'none' }} to={`/dashboard/food-item/details/${data.node.id}`}>
                {data.node.id}
              </Link>
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Category: <i>{data.node.category?.name ? data.node.category?.name : 'Uncategorised'}</i> </Typography>
          </Stack>

          <Stack direction='row' alignItems='center' justifyContent='space-between' gap={1}>
            <Typography sx={{ fontSize: '14px' }}><i style={{ fontWeight: 600 }}>kr </i> {data.node.priceWithTax}
              <i style={{ fontWeight: 400, fontSize: '13px' }}> (tax)</i> </Typography>
            <Typography sx={{ fontSize: { xs: '14px', lg: '14px', color: '#848995' } }}><i style={{ fontWeight: 600 }}>kr </i>{data.node.actualPrice} </Typography>
          </Stack>
        </Stack>
        <Stack direction='row' alignItems='center' justifyContent='space-between' mt={1}>
          <Button variant='outlined' onClick={() => setEditDialogOpen(true)} sx={{ bgcolor: '#fff', whiteSpace: 'nowrap' }}>Edit Now</Button>
          <Button onClick={toggleDrawer} endIcon={<ArrowRightAlt />}>Details</Button>
        </Stack>
      </Stack>
      {/* food details page */}
      <SlideDrawer openSlideDrawer={openSlideDrawer} toggleDrawer={toggleDrawer}>
        <FoodDetails fetchCategory={fetchCategory} data={data.node} toggleDrawer={toggleDrawer} />
      </SlideDrawer>
      {/* product edit dialog */}
      <CDialog openDialog={editDialogOpen}>
        <EditItem fetchCategory={fetchCategory} data={data.node} closeDialog={() => setEditDialogOpen(false)} />
      </CDialog>
    </Box>
  )
}

export default FoodCard