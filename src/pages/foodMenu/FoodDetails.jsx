import { useQuery } from '@apollo/client'
import { LocalOffer, NavigateBefore, West } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Avatar, Box, Button, IconButton, ListItem, ListItemIcon, ListItemText, Rating, Stack, Tab, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, unstable_HistoryRouter, useNavigate, useParams } from 'react-router-dom'
import { PRODUCTS } from './graphql/query'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import { useTheme } from '@emotion/react'

const FoodDetails = () => {
  const [tabValue, setTabValue] = useState('1');
  const [product, setProduct] = useState({});
  const [selectedImg, setSelectedImg] = useState(0)

  const { id } = useParams();
  const theme = useTheme()

  const navigate = useNavigate()

  const { loading, error } = useQuery(PRODUCTS, {
    variables: {
      id: id
    },
    onCompleted: (res) => {
      setProduct(res.products.edges[0].node)
    }
  })
  console.log(product)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '1000px' }}>
      {
        loading ? <Loader /> : error ? <ErrorMsg /> :
          <>

            <Stack direction='row' alignItems='center' gap={2} mb={2}>
              <IconButton onClick={() => navigate(-1)}>
                <West />
              </IconButton>
              <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Food Details</Typography>
            </Stack>
            <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
              <Stack direction='row' gap={2}>
                <Stack sx={{
                  maxHeight: '600px',
                  mr: 4
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
                      width: { xs: '100%', lg: '457px' },
                      height: '560px',
                      display: selectedImg === id ? 'block' : 'none '
                    }}>
                      <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        src={item.node.fileUrl ? item.node.fileUrl : ''} alt="" />
                    </Box>
                  ))
                }
              </Stack>
              <Box sx={{
                // flex:1
              }}>
                {
                  product.vendor &&
                  <Box sx={{
                    border: '1px solid coral',
                    p: 2, borderRadius: '8px'
                  }} mb={1}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        bgcolor: 'coral',
                        color: '#fff',
                        px: 1, mb: 1, borderRadius: '4px',
                        width: 'fit-content'
                      }}>
                      Vendor
                    </Typography>
                    <Link to={`/dashboard/suppliers/details/${product.vendor.id}`}>
                      <Typography><b>Name: </b>{product.vendor?.name}</Typography>
                    </Link>
                    <Typography><b>Email: </b>{product.vendor?.email}</Typography>
                  </Box>
                }
                <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>{product.name}</Typography>
                {/* <Stack direction='row' gap={1} mt={2} alignItems='center'>
                  <Rating size='small' sx={{ color: 'primary.main' }} value={4} readOnly />
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>157 Reviews</Typography>
                </Stack> */}
                <Stack direction='row' gap={4} mt={2} alignItems='flex-end'>
                  <Typography sx={{ fontSize: { xs: '18px', lg: '24px', fontWeight: 600 } }}>${product.priceWithTax}
                    <i style={{ fontWeight: 400, fontSize: '16px' }}> (Incl. Tax)</i> </Typography>
                  <Typography sx={{ fontSize: { xs: '18px', lg: '16px', fontWeight: 600, color: '#848995' } }}>${product.actualPrice}</Typography>
                </Stack>
                {/* <Stack direction='row' gap={2} mt={2}>
                  <LocalOffer fontSize='small' />
                  <Typography sx={{ fontSize: '14px' }}>Save 50% right now</Typography>
                </Stack> */}
                <Typography sx={{ fontSize: { xs: '14px', lg: '16px', fontWeight: 600 }, mt: 2 }}>Contains:</Typography>
                <Typography>{product.contains && typeof product.contains === 'string' ? JSON.parse(product.contains) : ''}</Typography>

              </Box>
            </Stack>
            <Box sx={{ width: '100%', mt: 5 }}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: '1px solid lightgray', }}>
                  <TabList onChange={handleTabChange} >
                    {/* <Tab sx={{ textTransform: 'none', mr: { xs: 0, md: 10 } }} label="Description" value="1" /> */}
                    <Tab sx={{ textTransform: 'none', mr: { xs: 0, md: 10 } }} label="Reviews" value="1" />
                    {/* <Tab sx={{ textTransform: 'none' }} label="Support" value="3" /> */}
                  </TabList>
                </Box>
                {/* <TabPanel value="1">Description</TabPanel> */}
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
            </Box>
          </>
      }
    </Box>
  )
}

export default FoodDetails