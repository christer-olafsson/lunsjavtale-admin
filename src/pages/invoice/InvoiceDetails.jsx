import { ArrowBackIos, BorderColor } from '@mui/icons-material'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from '@mui/lab'
import { Box, Button, Divider, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, NativeSelect, Paper, Rating, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const InvoiceDetails = () => {
  const downloadPDF = () => {
    const button = document.getElementById('downloadButton');
    const input = document.getElementById('invoice');

    // Hide the download button
    button.style.display = 'none';

    html2canvas(input, { scale: 1.5 }) // Adjust scale for balance between quality and size
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.7); // Lower the quality to reduce size
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, '', 'FAST'); // Add 'FAST' for additional compression
        pdf.save('invoice.pdf');

        // Show the download button again
        button.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);

        // Show the download button again in case of an error
        button.style.display = 'block';
      });
  };

  return (
    <Box id="invoice" maxWidth='xl' sx={{ p: 2, color: 'black' }}>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Invoice  Details</Typography>

      <Stack direction={{ xs: 'column', lg: 'row' }} mt={3} gap={2} justifyContent='space-between'>
        <Stack direction='row' gap={2}>
          <Link to='/dashboard/invoice'>
            <IconButton><ArrowBackIos /></IconButton>
          </Link>
          <Box>
            <Typography sx={{ fontSize: '14px' }}>Feb 09, 2022, Today at 5:43 am </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Order ID: #987654</Typography>
          </Box>
        </Stack>
        <Stack direction='row' gap={2}>
          <Button id='downloadButton' onClick={downloadPDF} variant='contained'>Download Invoice</Button>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 2 }} />

      <Stack direction={{ xs: 'column', lg: 'row' }} m={3} gap={6}>

        <Box sx={{
          flex: 2
        }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Invoice Information</Typography>
          <Box sx={{ mt: 2 }}>
            <table className="shopping-cart-table">
              <thead>
                <tr>
                  <th>Product Description</th>
                  <th>Item Price</th>
                  <th>Qty</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>The lunch collective's Caesar salad</td>
                  <td>$427.33 </td>
                  <td>x6</td>
                  <td>$200.00</td>
                </tr>
                <tr>
                  <td>The lunch collective's Caesar salad</td>
                  <td>$427.33 </td>
                  <td>x6</td>
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

export default InvoiceDetails