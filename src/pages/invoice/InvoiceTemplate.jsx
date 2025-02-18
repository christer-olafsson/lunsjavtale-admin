/* eslint-disable react/prop-types */
import { useQuery } from '@apollo/client';
import { ArrowBackIos, ArrowBackIosNewOutlined, BorderColor, CloseOutlined, DoneAll, FileDownloadOutlined } from '@mui/icons-material'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from '@mui/lab'
import { Avatar, Box, Button, Divider, IconButton, Stack, TextField, Typography } from '@mui/material'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CLIENT_DETAILS } from '../../graphql/query';
import { useState } from 'react';
import { format } from 'date-fns';


export const downloadPDF = () => {
  const invoiceBtn = document.getElementById('invoice-btn');
  const input = document.getElementById('invoice');

  // Hide the download button
  invoiceBtn.style.visibility = 'hidden';

  html2canvas(input, { scale: 3, useCORS: true }) // useCORS: true for show remote image
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


const InvoiceTemplate = ({ data, toggleDrawer }) => {
  const [clientDetails, setClientDetails] = useState({})

  // console.log(data)

  useQuery(CLIENT_DETAILS, {
    onCompleted: (res) => {
      setClientDetails(res.clientDetails)
    },
  });


  return (
    <Box sx={{
      width: '1100px',
      position: 'absolute',
      transform: 'translateY(-200%)',
      bgcolor: '#fff',
      // minHeight: '1300px',
      py: 4, px: 10,
      color: 'black',
      // border: '1px solid lightgray'
    }} id="invoice" >

      <Stack id='invoice-btn' direction='row' gap={2} alignItems='center'>
        <IconButton onClick={toggleDrawer}>
          <CloseOutlined />
        </IconButton>
        <Button onClick={downloadPDF} sx={{ borderRadius: '50px', height: '32px' }} variant='outlined' startIcon={<FileDownloadOutlined />}>Save</Button>
      </Stack>

      <Stack direction='row' justifyContent='space-between' alignItems='center' gap={6}>
        <img style={{ width: '200px' }} src="/Logo.png" alt="" />
        <Stack direction='row' gap={4}>
          <Stack>
            <Typography variant='h5' fontWeight={600} mb={2}>{clientDetails?.name}</Typography>
            <Typography variant='body'>{clientDetails?.address}</Typography>
            <Typography variant='body'>{clientDetails?.contact}</Typography>
            <Typography variant='body'>{clientDetails?.email}</Typography>
          </Stack>
        </Stack>

      </Stack>

      <Divider sx={{ mb: .5, mt: 6 }} />
      <Divider sx={{ mb: 6 }} />

      {/* <Stack direction='row' justifyContent='space-between'>
        <Stack>
          <Typography sx={{ fontWeight: 600, mb: 2 }}>Shipping Address</Typography>
          <Typography>{data?.shippingAddress?.fullName}</Typography>
          <Typography>{data?.shippingAddress?.address}</Typography>
          <Typography>{data?.shippingAddress?.city}, {data?.shippingAddress?.postCode}</Typography>
        </Stack>
        <Stack >
          <Typography sx={{ fontWeight: 600, mb: 2 }}>Billing Address</Typography>
          <Typography>{data?.billingAddress?.firstName + " " + data?.billingAddress?.lastName ?? ''}</Typography>
          <Typography>{data?.billingAddress?.address}</Typography>
        </Stack>
        <Stack>
          <Typography sx={{ fontWeight: 600, mb: 2 }}>Status</Typography>

          {
            data?.status === 'Delivered' &&
            <Typography sx={{ fontWeight: 600, display: 'inline-flex', color: 'green', alignItems: 'center', gap: 1 }} variant='body2'>{data?.status} <DoneAll fontSize='small' /> </Typography>
          }

        </Stack>
      </Stack> */}

      <Box>
        <Stack direction='row'>
          <Typography variant='h5' sx={{ width: '150px' }}> <b>Company:</b></Typography>
          <Typography variant='h5'>{data?.name}</Typography>
        </Stack>
        <Stack direction='row'>
          <Typography sx={{ width: '150px' }}> <b>Email:</b></Typography>
          <Typography>{data?.email}</Typography>
        </Stack>
        <Stack direction='row'>
          <Typography sx={{ width: '150px' }}> <b>Post Code:</b></Typography>
          <Typography>{data?.postCode}</Typography>
        </Stack>
      </Box>

      <Box mb={10} mt={8}>
        <Typography sx={{ fontSize: '25px', fontWeight: 600, mb: 2 }}>Due Invoice</Typography>
        <Stack gap={.8}>
          <Divider sx={{ borderBottomWidth: '3px', borderBottomColor: 'black' }} />
          {/* <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Order ID:</b></Typography>
            <Typography>#{data?.id}</Typography>
          </Stack> */}
          {/* <Divider /> */}
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Date:</b></Typography>
            {data?.createdOn && <Typography>{format(Date.now(), 'dd-MMM-yyyy, hh:mm a')}</Typography>}
          </Stack>
          <Divider />
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Total Due:</b></Typography>
            <Typography sx={{ color: 'red' }}> <b>{data?.balance}</b> kr</Typography>
          </Stack>
          <Divider />
        </Stack>
      </Box>

      <Box sx={{ mt: 4 }}>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Shipping Charge</th>
              <th>Total Amount</th>
              <th>Total Due</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.orders?.edges?.filter(({ node }) => !node.isFullPaid).map(({ node }) => {
                return (
                  <tr key={node.id}>
                    <td># {node.id}</td>
                    <td>

                      <Typography>
                        <span style={{ fontWeight: '500' }}>Order:</span>
                        <span style={{ marginLeft: '5px' }}>{format(node.createdOn, 'dd-MM-yyyy')}</span>
                        <span style={{ marginLeft: '5px', fontWeight: '600', fontSize: '12px' }}>{format(node.createdOn, 'hh:mm a')}</span>
                      </Typography>
                      <Typography>
                        <span style={{ fontWeight: '500' }}>Delivery:</span>
                        <span style={{ marginLeft: '5px' }}>{format(node.deliveryDate, 'dd-MM-yyyy')}</span>
                        <span style={{ marginLeft: '5px', fontWeight: '600', fontSize: '12px' }}>{format(node.deliveryDate, 'hh:mm a')}</span>
                      </Typography>

                    </td>
                    <td>{node?.shippingCharge} kr </td>
                    <td>{node?.finalPrice} kr </td>
                    <td>
                      <Typography>
                        {node?.dueAmount} kr
                        {node?.discountAmount > 0 && <span style={{ marginLeft: '5px', color: 'red', fontSize: '12px', fontWeight: 600 }}> (-{node?.discountAmount})</span>}
                      </Typography>
                    </td>
                  </tr>
                )
              })
            }

            <tr>
              <td style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ fontWeight: 'bold' }}>Total </td>
              <td style={{ fontWeight: 'bold' }}>{data?.balance} kr</td>
            </tr>

          </tbody>
        </table>
      </Box>

      {/* <Box sx={{ border: '1px solid lightgray', mt: 20, p: 2, minHeight: '150px' }}>
        <Typography sx={{ fontSize: '20px', mb: 2 }}>Note and Term</Typography>
        <Typography>{data?.note}</Typography>
      </Box> */}

      <Stack direction='row' justifyContent='flex-start' mt={20} >
        <Typography sx={{ fontSize: '20px', fontWeight: 600, borderTop: '1px solid gray' }}>Signature</Typography>

      </Stack>

    </Box>
  )
}

export default InvoiceTemplate