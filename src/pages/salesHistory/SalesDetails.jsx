import { ArrowBackIos, BorderColor } from '@mui/icons-material'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from '@mui/lab'
import { Box, Button, Divider, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, NativeSelect, Paper, Rating, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const SalesDetails = () => {
  const [ratingCount, setRatingCount] = useState(4);
  const [status, setStatus] = useState('');

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))

  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Sales Details</Typography>

      <Stack direction={{ xs: 'column', lg: 'row' }} mt={3} gap={2} justifyContent='space-between'>
        <Stack direction='row' gap={2}>
          <Link to='/dashboard/sales-history'>
            <IconButton><ArrowBackIos /></IconButton>
          </Link>
          <Box>
            <Typography sx={{ fontSize: '14px' }}>Feb 09, 2022, Today at 5:43 am </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Order ID: #987654</Typography>
          </Box>
        </Stack>
        <Stack direction='row' gap={2}>
          <Stack sx={{
            border: '1px solid lightgray',
            px: 2, borderRadius: '8px'
          }} direction='row' alignItems='center' gap={2}>
            <InputLabel sx={{ fontSize: '14px', fontWeight: 600 }}>Status:</InputLabel>
            <NativeSelect
              defaultValue={10}
              disableUnderline
            >
              <option value={10}>Pending</option>
              <option value={20}>Completed</option>
              <option value={30}>Rejected</option>
            </NativeSelect>
          </Stack>
          <Button startIcon={<BorderColor />} variant='contained'>Edit Details</Button>
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
                  <th>Number</th>
                  <th>Products</th>
                  {!isMobile && <th>Item Price</th>}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>The lunch collective's Caesar salad </td>
                  {!isMobile && <td>$200.00</td>}
                  <td>$200.00</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>The lunch collective's Caesar salad </td>
                  {!isMobile && <td>$200.00</td>}
                  <td>$200.00</td>
                </tr>
              </tbody>
            </table>
          </Box>

          <Box mt={3} maxWidth='700px'>
            <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Note</Typography>
            <Stack direction='row' justifyContent='space-between' mt={3}>
              <Stack sx={{ px: 2 }} gap={3}>
                <Typography>SubTotal</Typography>
                <Typography>Discount</Typography>
                <Typography>Company Allowance (25%) :</Typography>
                <Typography>Shipping Charge :</Typography>
                <Typography>Estimated Tax (12.5%) :</Typography>
                <Typography><b>Total Paid by Customer</b></Typography>
              </Stack>
              <Stack sx={{ px: 2, mb: 2 }} gap={3}>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', }}>$287.968</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', }}>$0.00</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', }}>$100.00</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', }}>$0.00</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', }}>$0.00</Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction='row' justifyContent='space-between'>
              <Stack sx={{ px: 2 }} gap={3}>
                <Typography><b>Sale Total</b></Typography>
                <Typography>Cash Rounding</Typography>
                <Typography>Cash </Typography>
              </Stack>
              <Stack sx={{ px: 2, mb: 2 }} gap={3}>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', fontWeight: 600 }}>$415.96</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', }}>$0.00</Typography>
                <Typography sx={{ textWrap: 'nowrap', alignSelf: 'flex-end', }}>$415.99</Typography>
              </Stack>
            </Stack>
          </Box>

        </Box>

        <Box sx={{
          flex: 1,
          px: 3
        }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 2 }}>Company Information</Typography>
          <Typography sx={{ fontSize: '16px' }}>Name</Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 4 }}>Brooklyn Simmons</Typography>
          <Typography sx={{ fontSize: '16px' }}>Email</Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 4 }}>jackson.graham@example.com</Typography>
          <Typography sx={{ fontSize: '16px' }}>Shipping address</Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 4 }}>1901 Thornridge Cir. Shiloh, Hawaii, 81063</Typography>
          <Typography sx={{ fontSize: '16px' }}>Billing address</Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 4 }}>Same as shipping address</Typography>
        </Box>

      </Stack>

    </Box>
  )
}

export default SalesDetails