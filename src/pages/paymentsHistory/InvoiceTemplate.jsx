import { ArrowBackIos, ArrowBackIosNewOutlined, BorderColor, CloseOutlined, FileDownloadOutlined } from '@mui/icons-material'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from '@mui/lab'
import { Box, Button, Divider, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, NativeSelect, Paper, Rating, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const InvoiceTemplate = ({data,toggleDrawer}) => {

  console.log(data)

  const downloadPDF = () => {
    const invoiceBtn = document.getElementById('invoice-btn');
    const input = document.getElementById('invoice');

    // Hide the download button
    invoiceBtn.style.visibility = 'hidden';

    html2canvas(input, { scale: 1.5 }) // Adjust scale for balance between quality and size
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.7); // Lower the quality to reduce size
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, '', 'FAST'); // Add 'FAST' for additional compression
        pdf.save('invoice.pdf');

        // Show the download button again
        invoiceBtn.style.visibility = 'visible';
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        // Show the download button again in case of an error
        invoiceBtn.style.visibility = 'visible';
      });
  };

  return (
    <Box sx={{
      width: '1100px',
      minHeight: '1300px',
      p: 4,
      color: 'black',
      // border: '1px solid lightgray'
    }} id="invoice" >

      <Stack id='invoice-btn' direction='row' gap={2} alignItems='center'>
        <IconButton onClick={toggleDrawer}>
          <CloseOutlined />
        </IconButton>
        <Button onClick={downloadPDF} sx={{ borderRadius: '50px', height: '32px' }} variant='outlined' startIcon={<FileDownloadOutlined />}>Save</Button>
      </Stack>

      <Stack direction='row' justifyContent='space-between'>
        <Stack direction='row' gap={4}>
          <img style={{ width: '200px' }} src="/Logo.svg" alt="" />
          <Stack>
            <Typography variant='h5' fontWeight={600} mb={2}>Lunsjavtale Gestronomen</Typography>
            <Typography variant='body'>Restaurant Address 1</Typography>
            <Typography variant='body' mb={3}>City 1, State2, 1400</Typography>
            <Typography variant='body'>+8836253522</Typography>
            <Typography variant='body'>hei@lunsjavtali.no</Typography>
          </Stack>
        </Stack>
        <Stack>
          <Typography variant='h5' fontWeight={600}>Invoice</Typography>
        </Stack>
      </Stack>

      <Divider sx={{ mb: .5, mt: 3 }} />
      <Divider sx={{ mb: 3 }} />

      <Stack direction='row' justifyContent='space-between'>
        <Stack direction='row' gap={3}>
          <Typography variant='h6'>Bill To</Typography>
          <Stack>
            <Typography>John Doe</Typography>
            <Typography>Client Address Line 1</Typography>
            <Typography>City 1, State2, 1400</Typography>
          </Stack>
        </Stack>
        <Stack direction='row' gap={3}>
          <Stack alignItems='flex-end'>
            <Typography sx={{ fontWeight: 600 }}>Invoice Number</Typography>
            <Typography sx={{ fontWeight: 600 }}>Date</Typography>
            <Typography sx={{ fontWeight: 600 }}>Due Date</Typography>
            <Typography sx={{ fontWeight: 600 }}>Terms</Typography>
          </Stack>
          <Stack alignItems='flex-end'>
            <Typography>2001321</Typography>
            <Typography>17/07/2024</Typography>
            <Typography></Typography>
            <Typography></Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box sx={{ mt: 4 }}>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product Description</th>
              <th>Qty</th>
              <th>Item Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>The lunch collective's Caesar salad</td>
              <td>x6</td>
              <td>$427.33 </td>
              <td>$200.00</td>
            </tr>
            <tr>
              <td>The lunch collective's Caesar salad</td>
              <td>x6</td>
              <td>$427.33 </td>
              <td>$200.00</td>
            </tr>
            <tr>
              <td style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ fontWeight: 'bold' }}>Total </td>
              <td style={{ fontWeight: 'bold' }}>$400.00</td>
            </tr>
            <tr>
              <td style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ fontWeight: 'bold' }}>Due Amount </td>
              <td style={{ fontWeight: 'bold' }}>$400.00</td>
            </tr>
            <tr>
              <td style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ fontWeight: 'bold' }}>Paid Amount </td>
              <td style={{ fontWeight: 'bold' }}>$00.00</td>
            </tr>
          </tbody>
        </table>
      </Box>

      <Box sx={{ border: '1px solid lightgray', mt: 20, p: 2, minHeight: '150px' }}>
        <Typography>Note and Term</Typography>
      </Box>

    </Box>
  )
}

export default InvoiceTemplate