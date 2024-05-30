import { Add, ArrowBack, ArrowDropDown, BorderColor, Search } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Input, Rating, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ORDER } from './graphql/query';
import { useQuery } from '@apollo/client';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from '@mui/lab'
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import CDialog from '../../common/dialog/CDialog';
import SelectedStaffs from './SelectedStaffs';


const OrderDetails = () => {
  const [order, setOrder] = useState([]);
  const [ratingCount, setRatingCount] = useState(5);
  const [selectedStaffsDialogOpen, setSelectedStaffsDialogOpen] = useState(false)

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))

  const { id } = useParams()

  const { loading, error: orderErr } = useQuery(ORDER, {
    variables: {
      id,
    },
    onCompleted: (res) => {
      setOrder(res.order)
    },
  });

  const navigate = useNavigate()



  return (
    <Box>
      <Stack direction='row' gap={2}>
        <IconButton onClick={() => navigate('/dashboard/orders')}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Order Details</Typography>
      </Stack>
      <Box mt={3}>
        <Stack direction='row' justifyContent='space-between'>
          <Box>
            <Typography><b>Delivery Date:</b> {order?.deliveryDate}</Typography>
            <Typography><b>Total Price:</b> {order?.finalPrice}</Typography>
          </Box>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 2,
            width: 'fit-content',
            height: '40px',
            bgcolor: order?.status === 'Placed' ? '#40A578' : '#E9EDFF',
            color: order?.status === 'Placed' ? '#fff' : 'inherit',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <Typography variant='body2'><b>Status: </b>{order?.status}</Typography>
          </Box>
        </Stack>
        <Divider sx={{ mt: 2 }} />

        <Stack direction={{ xs: 'column', lg: 'row' }} mt={3} gap={6}>


          <Box sx={{ flex: 2 }}>
            <Stack gap={3}>
              {
                loading ? <Loader /> : orderErr ? <ErrorMsg /> :
                  order?.orderCarts?.edges.map(data => (
                    <Stack sx={{
                      border: '1px solid lightgray',
                      maxWidth: '800px',
                      borderRadius: '8px'
                    }} key={data.node.id} direction='row' gap={2} alignItems='center' justifyContent='space-between'>
                      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems='center'>
                        <img style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          margin: '10px'
                        }} src={data?.node.item.attachments?.edges.find(item => item.node.isCover)?.node.fileUrl ?? "/noImage.png"} alt="" />
                        <Box ml={2} mb={2}>
                          <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{data?.node.item.name}</Typography>
                          <Typography variant='body2'>Category: <b>{data?.node.item.category.name}</b></Typography>
                          <Typography>Price: <b>{data?.node.item.priceWithTax}</b> kr</Typography>
                        </Box>
                      </Stack>
                      <Stack gap={.5} mr={2}>
                        <Typography>Quantity: <b>{data?.node.orderedQuantity}</b> </Typography>
                        <Typography>Total Price: <b>{data?.node.totalPriceWithTax}</b> kr</Typography>
                        <Button onClick={() => setSelectedStaffsDialogOpen(true)} variant='outlined' size='small' endIcon={<ArrowDropDown />}>
                          Selected Staffs ({data?.node.users?.edges?.length})
                        </Button>
                      </Stack>
                      {/* selected staffs */}
                      <CDialog
                        fullScreen={isMobile}
                        maxWidth='md'
                        openDialog={selectedStaffsDialogOpen}
                        closeDialog={() => setSelectedStaffsDialogOpen(false)}
                      >
                        <SelectedStaffs
                          closeDialog={() => setSelectedStaffsDialogOpen(false)}
                          users={data?.node.users?.edges}
                        />
                      </CDialog>
                    </Stack>
                  ))
              }
            </Stack>
            <Box mt={6} maxWidth='700px'>
              <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 3 }}>Timeline</Typography>
              <Timeline sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
              }}>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: 'primary.main' }} />
                    <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Stack direction='row' justifyContent='space-between'>
                      <Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Feb 09, Monday 2024 </Typography>
                        <Typography sx={{ fontSize: '14px' }}>order place</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '14px' }}>3.35 am</Typography>
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: 'primary.main' }} />
                    <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Stack direction='row' justifyContent='space-between'>
                      <Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Feb 10, Monday 2024 </Typography>
                        <Typography sx={{ fontSize: '14px' }}>order confirmed, waiting for payment</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '14px' }}>5.20 pm</Typography>
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: 'primary.main' }} />
                    <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Stack direction='row' justifyContent='space-between'>
                      <Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Feb 10, Monday 2024 </Typography>
                        <Typography sx={{ fontSize: '14px' }}>payment confirmed </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '14px' }}>6.50 pm</Typography>
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: 'primary.main' }} />
                    <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Stack direction='row' justifyContent='space-between'>
                      <Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Feb 11, Monday 2024 </Typography>
                        <Typography sx={{ fontSize: '14px' }}>product sent to example company</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '14px' }}>4.50 am</Typography>
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: 'primary.main' }} />
                    <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Stack direction='row' justifyContent='space-between'>
                      <Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Feb 11, Monday 2024 </Typography>
                        <Typography sx={{ fontSize: '14px' }}>product picked by delivery man</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '14px' }}>1.20 pm</Typography>
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </Box>
          </Box>

          <Box sx={{
            flex: 1,
            px: 3
          }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 2 }}>Customer Information</Typography>
            <Typography sx={{ fontSize: '16px' }}>Name</Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 4 }}>Brooklyn Simmons</Typography>
            <Typography sx={{ fontSize: '16px' }}>Email</Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 4 }}>jackson.graham@example.com</Typography>
            <Typography sx={{ fontSize: '16px' }}>Shipping address</Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 4 }}>1901 Thornridge Cir. Shiloh, Hawaii, 81063</Typography>
            <Typography sx={{ fontSize: '16px' }}>Billing address</Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 4 }}>Same as shipping address</Typography>
            <Typography sx={{ fontSize: '16px', mb: 1 }}>Payment</Typography>
            <Stack direction='row' gap={2}>
              <Box sx={{
                bgcolor: 'light.main',
                width: '72px', height: '58px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}>
                <img src="/visaicon.png" alt="" />
              </Box>
              <Box>
                <Typography>Visa</Typography>
                <Typography>******42342</Typography>
              </Box>
            </Stack>

            <Stack sx={{ mt: 6 }} gap={2}>
              <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 1 }}>Write a Review</Typography>
              <Rating sx={{ color: 'primary.main' }} value={ratingCount} onChange={(event, newValue) => {
                setRatingCount(newValue);
              }}
              />
              <TextField variant='standard' label='Title' />
              <TextField variant='standard' label='Review (Optional)' />
              <Button variant='contained' sx={{ alignSelf: 'flex-end' }}>Send</Button>
            </Stack>
          </Box>

        </Stack>

      </Box >
    </Box >
  )
}

export default OrderDetails