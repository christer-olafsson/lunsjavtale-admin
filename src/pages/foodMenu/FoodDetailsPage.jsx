import { useLazyQuery, useQuery } from '@apollo/client'
import { LocalOffer, NavigateBefore, West } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Avatar, Box, Button, IconButton, ListItem, ListItemIcon, ListItemText, Rating, Stack, Tab, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, unstable_HistoryRouter, useNavigate, useParams } from 'react-router-dom'
import { PRODUCTS } from './graphql/query'
import { useTheme } from '@emotion/react'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import CDialog from '../../common/dialog/CDialog'
import EditItem from './EditItem'

const FoodDetails = () => {
  const [tabValue, setTabValue] = useState('1');
  const [product, setProduct] = useState({});
  const [selectedImg, setSelectedImg] = useState(0)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  console.log(editDialogOpen)
  const { id } = useParams();
  const theme = useTheme()

  const navigate = useNavigate()

  const [fetchProduct, { loading, error }] = useLazyQuery(PRODUCTS, {
    variables: {
      id: id
    },
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setProduct(res.products.edges[0].node)
      // setEditDialogOpen(false)
    }
  })

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetchProduct()
  }, [id])


  return (
    <Box maxWidth='xl' sx={{ minHeight: '1000px' }}>
      {
        loading ? <Loader /> : error ? <ErrorMsg /> :
          <>
            <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
              <Stack direction='row' alignItems='center' gap={2} mb={2}>
                <IconButton onClick={() => navigate(-1)}>
                  <West />
                </IconButton>
                <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Food Details</Typography>
              </Stack>
              <Button variant='contained' onClick={() => setEditDialogOpen(true)}>Edit</Button>
            </Stack>
            {/* product edit dialog */}
            <CDialog openDialog={editDialogOpen}>
              <EditItem fetchCategory={fetchProduct} data={product} closeDialog={() => setEditDialogOpen(false)} />
            </CDialog>
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
                <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>{product.name}</Typography>
                <Stack direction='row' alignItems='center' gap={1} my={1}>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      bgcolor: product.availability ? 'primary.main' : 'darkgray',
                      color: '#fff',
                      px: 1, borderRadius: '4px',
                    }}>
                    {product.availability ? 'Available' : 'Not Available'}
                  </Typography>
                  {
                    product?.vendor !== null &&
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
                  product?.vendor &&
                  <Stack direction='row' gap={.5} mb={1}>
                    <Link
                      style={{ fontSize: '14px', textDecoration: 'none' }}
                      to={`/dashboard/suppliers/details/${product?.vendor.id}`}>
                      {product?.vendor?.name}
                    </Link>
                    {product?.vendor?.isDeleted && <i style={{ color: 'coral' }}>(deleted)</i>}
                  </Stack>
                }
                <Stack direction='row' gap={2} mb={1}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>id: #
                    <Link style={{ textDecoration: 'none' }} to={`/dashboard/food-item/details/${product.id}`}>
                      {product.id}
                    </Link>
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Category: <i>{product.category?.name ? product.category?.name : 'Uncategorised'}</i> </Typography>
                </Stack>

                <Stack direction='row' alignItems='center' justifyContent='space-between' gap={1}>
                  <Typography sx={{ fontSize: '16px' }}><i style={{ fontWeight: 600 }}>kr </i> {product.priceWithTax}
                    <i style={{ fontWeight: 400, fontSize: '13px' }}> (tax)</i> </Typography>
                  <Typography sx={{ fontSize: { xs: '14px', lg: '14px', color: '#848995' } }}><i style={{ fontWeight: 600 }}>kr </i>{product.actualPrice} </Typography>
                </Stack>
                <Typography sx={{ fontSize: { xs: '14px', lg: '16px', fontWeight: 600 }, mt: 2 }}>Contains:</Typography>
                <Typography>{product.contains && typeof product.contains === 'string' ? JSON.parse(product.contains) : ''}</Typography>
              </Box>
            </Stack>
            {/* <Box sx={{ width: '100%', mt: 5 }}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: '1px solid lightgray', }}>
                  <TabList onChange={handleTabChange} >
                    <Tab sx={{ textTransform: 'none', mr: { xs: 0, md: 10 } }} label="Description" value="1" />
                    <Tab sx={{ textTransform: 'none', mr: { xs: 0, md: 10 } }} label="Reviews" value="2" />
                    <Tab sx={{ textTransform: 'none' }} label="Support" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">Description</TabPanel>
                <TabPanel value="2">
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
          </>
      }
    </Box>
  )
}

export default FoodDetails