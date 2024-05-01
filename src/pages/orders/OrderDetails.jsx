import { ArrowBackIos } from '@mui/icons-material'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from '@mui/lab'
import { Box, Button, Divider, IconButton, Paper, Rating, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const OrderDetails = () => {
  const [ratingCount, setRatingCount] = useState(4);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))

  return (
    <Box maxWidth={'lg'}>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Order Details</Typography>

      <Stack direction={{ xs: 'column', lg: 'row' }} mt={3} gap={2} justifyContent='space-between'>
        <Stack direction='row' gap={2}>
          <Link to='/dashboard/orders/'>
            <IconButton><ArrowBackIos /></IconButton>
          </Link>
          <Box>
            <Typography sx={{ fontSize: '14px' }}>Feb 09, 2022, Today at 5:43 am </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Order ID: #987654</Typography>
          </Box>
        </Stack>
        <Stack direction='row' gap={2}>
          <Button variant='outlined' disableRipple><b>Status:</b>Complete</Button>
          <Button variant='contained'>Download Invoice</Button>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 2 }} />

      <Stack direction={{ xs: 'column', lg: 'row' }} m={3} gap={6}>

        <Box sx={{
          flex: 2
        }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Order Information</Typography>
          <Box sx={{ mt: 2 }}>
            <table className="shopping-cart-table">
              <thead>
                <tr>
                  <th>Employer Id</th>
                  <th>Product</th>
                  {!isMobile && <th>Item Price</th>}
                  {!isMobile && <th>Qty</th>}
                  <th>Item Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#6565876</td>
                  <td>The lunch collective's Caesar salad </td>
                  {!isMobile && <td>$200.00</td>}
                  {!isMobile && <td>x1</td>}
                  <td>$200.00</td>
                </tr>
                <tr>
                  <td>#6565876</td>
                  <td>The lunch collective's Caesar salad </td>
                  {!isMobile && <td>$200.00</td>}
                  {!isMobile && <td>x1</td>}
                  <td>$200.00</td>
                </tr>
              </tbody>
            </table>
          </Box>

          <Box mt={3} maxWidth='700px'>
            <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Paid by Customer</Typography>
            <Stack direction='row' justifyContent='space-between' mt={3}>
              <Stack sx={{ px: 2 }} gap={3}>
                <Typography>SubTotal</Typography>
                <Typography>Tax</Typography>
                <Typography>Discount</Typography>
                <Typography><b>Total Paid by Customer</b></Typography>
              </Stack>
              <Stack sx={{ px: 2, mb: 2 }} gap={3}>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', fontWeight: 600 }}>$ 200.00</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', fontWeight: 600 }}>- $ 11.99</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', fontWeight: 600 }}>$ -$00.00</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', fontWeight: 600 }}>$ 211.00</Typography>
              </Stack>
            </Stack>
          </Box>

          <Box mt={3} maxWidth='700px'>
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
        </Box>

      </Stack>

    </Box>
  )
}

export default OrderDetails