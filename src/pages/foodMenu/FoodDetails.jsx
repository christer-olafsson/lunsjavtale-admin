/* eslint-disable react/prop-types */
import { useQuery } from '@apollo/client'
import { Close, LocalOffer, NavigateBefore, West } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Avatar, Box, Button, IconButton, ListItem, ListItemIcon, ListItemText, Rating, Stack, Tab, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, unstable_HistoryRouter, useNavigate, useParams } from 'react-router-dom'
import { PRODUCTS } from './graphql/query'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import { useTheme } from '@emotion/react'

const FoodDetails = ({ data, toggleDrawer }) => {
  const [tabValue, setTabValue] = useState('1');
  const [product, setProduct] = useState({});
  const [selectedImg, setSelectedImg] = useState(0)

  const theme = useTheme()

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setProduct(data)
  }, [data])


  return (
    <Box sx={{ p: 4,width: '100vw' }} maxWidth='1000px'>
      <Stack direction='row' alignItems='center' gap={2} mb={2}>
        <IconButton onClick={toggleDrawer}>
          <Close />
        </IconButton>
        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Food Details</Typography>
      </Stack>
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
        <Stack direction={{ xs: 'column-reverse', md: 'row' }} gap={2}>
          <Stack direction={{ xs: 'row', md: 'column' }} sx={{
            maxHeight: '600px',
          }} flexWrap='wrap' gap={2}>
            {
              product?.attachments?.edges.map((item, id) => (
                <Box onClick={() => setSelectedImg(id)} key={id} sx={{
                  width: '100px',
                  height: '100px',
                  cursor: 'pointer',
                  border: selectedImg === id ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: '8px',
                  p: selectedImg === id ? .3 : 0
                }}>
                  <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    src={item.node.fileUrl ? item.node.fileUrl : ''} alt="" />
                </Box>
              ))
            }
          </Stack>
          {
            product?.attachments?.edges.map((item, id) => (
              <Box key={id} sx={{
                // flex:1,
                width: { xs: '100%', md: '457px' },
                height: { xs: '400px', md: '560px' },
                display: selectedImg === id ? 'block' : 'none '
              }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  src={item.node.fileUrl ? item.node.fileUrl : ''} alt="" />
              </Box>
            ))
          }
        </Stack>
        <Stack gap={1.5}>
          <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>{product?.name}</Typography>
          {/* <Stack direction='row' gap={1} alignItems='center'>
                  <Rating size='small' sx={{ color: 'primary.main' }} value={5} readOnly />
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>3 Reviews</Typography>
                </Stack> */}
          <Typography sx={{ fontSize: { xs: '18px', lg: '24px', fontWeight: 600 } }}>
            <i style={{ fontWeight: 400 }}>kr </i>
            {product?.priceWithTax}<i style={{ fontWeight: 400, fontSize: '16px' }}> (Incl. Tax)</i>
          </Typography>
          {
            product?.vendor &&
            <Stack sx={{
              border: '1px solid coral',
              p: 2, borderRadius: '8px',
              width: 'fit-content'
            }}>
              <Typography sx={{ fontWeight: 600 }}>Supplier:</Typography>
              <Link to={`/dashboard/suppliers/details/${product?.vendor.id}`}>
                {product?.vendor.name}
              </Link>
            </Stack>
          }

          {/* <Stack direction='row' gap={2} mt={2}>
                  <LocalOffer fontSize='small' />
                  <Typography sx={{ fontSize: '14px' }}>Save 50% right now</Typography>
                </Stack> */}
          <Box>
            <Typography sx={{ fontSize: { xs: '14px', lg: '16px' }, fontWeight: 600 }}> <i>Description:</i> </Typography>
            <Typography sx={{ fontSize: { xs: '14px', lg: '16px' } }}>{product?.description}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: { xs: '14px', lg: '16px' }, fontWeight: 600 }}> <i>Contains:</i> </Typography>
            <Typography sx={{ fontSize: { xs: '14px', lg: '16px' } }}>{product.contains && typeof product.contains === 'string' ? JSON.parse(product.contains) : ''}</Typography>
          </Box>
          {
            product?.ingredients?.edges.length > 0 &&
            <Box>
              <Typography sx={{ fontSize: { xs: '14px', lg: '16px' }, fontWeight: 600 }}> <i>Allergies: </i> </Typography>
              <ul>
                {
                  product?.ingredients?.edges.map(item => (
                    <li style={{ fontSize: '14px' }} key={item.node.id}>{item.node.name}</li>
                  ))
                }
              </ul>
            </Box>
          }
        </Stack>
      </Stack>
      {/* <Box sx={{ width: '100%', mt: 5 }}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: '1px solid lightgray', }}>
                  <TabList onChange={handleTabChange} >
                    <Tab sx={{ textTransform: 'none', mr: { xs: 0, md: 10 } }} label="Description" value="1" />
                    <Tab sx={{ textTransform: 'none', mr: { xs: 0, md: 10 } }} label="Reviews" value="1" />
                    <Tab sx={{ textTransform: 'none' }} label="Support" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">Description</TabPanel>
                <TabPanel value="1">
                  <Stack gap={5}>
                    {
                      [1, 2, 3].map((item, id) => (
                        <Stack key={id} direction='row' gap={2}>
                          <Avatar />
                          <Stack gap={2}>
                            <Rating size='small' sx={{ color: 'primary.main' }} value={5} readOnly />
                            <Typography>You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the changes.</Typography>
                            <Box>
                              <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Jenny Wilson</Typography>
                              <Typography sx={{ fontSize: '12px', }}>March 14, 2021</Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      ))
                    }
                  </Stack>
                </TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
              </TabContext>
            </Box> */}
    </Box>
  )
}

export default FoodDetails