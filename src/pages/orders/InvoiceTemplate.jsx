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

  // console.log('invoice', data)

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
        <Stack direction='row' gap={4}>
          <img style={{ width: '200px' }} src="/Logo.svg" alt="" />
          <Stack>
            <Typography variant='h5' fontWeight={600} mb={2}>{clientDetails?.name}</Typography>
            <Typography variant='body'>{clientDetails?.address}</Typography>
            <Typography variant='body'>{clientDetails?.contact}</Typography>
            <Typography variant='body'>{clientDetails?.email}</Typography>
          </Stack>
        </Stack>
        <Box>
          <Stack direction='row'>
            <Typography sx={{ width: '100px' }}> <b>Company:</b></Typography>
            <Typography>{data?.company?.name}</Typography>
          </Stack>
          <Stack direction='row'>
            <Typography sx={{ width: '100px' }}> <b>Email:</b></Typography>
            <Typography>{data?.company?.email}</Typography>
          </Stack>
          <Stack direction='row'>
            <Typography sx={{ width: '100px' }}> <b>Post Code:</b></Typography>
            <Typography>{data?.company?.postCode}</Typography>
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ mb: .5, mt: 6 }} />
      <Divider sx={{ mb: 6 }} />

      <Stack direction='row' justifyContent='space-between'>
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
      </Stack>

      <Box mb={10} mt={8}>
        <Typography sx={{ fontSize: '25px', fontWeight: 600, mb: 2 }}>Invoice</Typography>
        <Stack gap={.8}>
          <Divider sx={{ borderBottomWidth: '3px', borderBottomColor: 'black' }} />
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Order ID:</b></Typography>
            <Typography>#{data?.id}</Typography>
          </Stack>
          <Divider />
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Order Date:</b></Typography>
            {data?.createdOn && <Typography>{format(data?.createdOn, 'dd-MMMM-yyyy hh:mm a')}</Typography>}
          </Stack>
          <Divider />
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Delivery Date:</b></Typography>
            {data?.deliveryDate && <Typography>{format(data?.deliveryDate, 'dd-MMMM-yyyy')}</Typography>}
          </Stack>
          <Divider />
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Payment Type:</b></Typography>
            <Typography>{data?.paymentType === 'online' ? 'Vipps' : data?.paymentType}</Typography>
          </Stack>
          {
            data?.coupon &&
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Coupon:</b></Typography>
              <Typography sx={{ bgcolor: 'coral', px: 1, borderRadius: '4px', color: '#fff' }}>{data?.coupon.name}</Typography>
            </Stack>
          }
          {
            data?.discountAmount > 0.00 &&
            <Stack direction='row'>
              <Typography sx={{ width: '200px', whiteSpace: 'nowarp' }}> <b>Discount Amount:</b></Typography>
              <Typography>{data?.discountAmount} kr</Typography>
            </Stack>
          }
          <Divider />
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Total Price:</b></Typography>
            <Typography>{data?.finalPrice} kr</Typography>
          </Stack>
          <Divider />
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Due Amount:</b></Typography>
            <Typography>{data?.dueAmount} kr</Typography>
          </Stack>
          <Divider />
          <Stack direction='row'>
            <Typography sx={{ width: '200px' }}> <b>Paid Amount:</b></Typography>
            <Typography>{data?.paidAmount} kr</Typography>
          </Stack>
          <Divider />
        </Stack>
      </Box>

      <Box sx={{ mt: 4 }}>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product Description</th>
              <th>Item Price</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.orderCarts?.edges?.map(item => {
                const img = item.node.item.attachments.edges.find(item => item.node.isCover)?.node.fileUrl
                return (
                  <tr key={item.node.id}>
                    <td>
                      <Stack direction='row' gap={1.5} alignItems='center'>
                        <img style={{ width: '70px', height: '50px', objectFit: 'contain' }}
                          src={img ?? ''} />
                        {/* <Avatar sx={{ borderRadius: '10px', width: '70px' }} src={img ?? ''} /> */}
                        <Box>
                          <Typography>{item?.node.item.name}</Typography>
                          <Typography variant='body2'>Category: {item?.node.item.category.name}</Typography>
                        </Box>
                      </Stack>
                    </td>
                    <td>{item?.node?.priceWithTax} kr </td>
                    <td>x {item?.node?.orderedQuantity}</td>
                    <td>{item?.node?.totalPriceWithTax} kr</td>
                  </tr>
                )
              })
            }
            {/* <tr>
              <td>The lunch collective's Caesar salad</td>
              <td>x6</td>
              <td>$427.33 </td>
              <td>$200.00</td>
            </tr> */}
            {
              data?.discountAmount > 0.00 &&
              <tr>
                <td style={{ border: 'none' }}></td>
                <td style={{ border: 'none' }}></td>
                <td style={{ fontWeight: 'bold' }}>Discount </td>
                <td style={{ fontWeight: 'bold', color: 'red' }}> - {data?.discountAmount} kr</td>
              </tr>
            }
            <tr>
              <td style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ fontWeight: 'bold' }}>Total </td>
              <td style={{ fontWeight: 'bold' }}>{data?.finalPrice} kr</td>
            </tr>
            {/* <tr>
              <td style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ fontWeight: 'bold' }}>Due Amount </td>
              <td style={{ fontWeight: 'bold' }}>{data?.dueAmount} kr</td>
            </tr>
            <tr>
              <td style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ fontWeight: 'bold' }}>Paid Amount </td>
              <td style={{ fontWeight: 'bold' }}>{data?.paidAmount} kr</td>
            </tr> */}
          </tbody>
        </table>
      </Box>

      <Box sx={{ border: '1px solid lightgray', mt: 20, p: 2, minHeight: '150px' }}>
        <Typography sx={{ fontSize: '20px', mb: 2 }}>Note and Term</Typography>
        <Typography>{data?.note}</Typography>
      </Box>

    </Box>
  )
}

export default InvoiceTemplate