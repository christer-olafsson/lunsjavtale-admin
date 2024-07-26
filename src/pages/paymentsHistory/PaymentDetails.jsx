import { useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ORDER_PAYMENT } from './graphql/query';
import InvoiceDetails from '../invoice/InvoiceDetails';
import InvoiceTemplate from './InvoiceTemplate';
import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ArrowBack, FileDownloadOutlined, KeyboardDoubleArrowRightOutlined } from '@mui/icons-material';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import { format } from 'date-fns';
import SlideDrawer from '../../common/drawer/SlideDrawer';

const PaymentDetails = () => {
  const [payment, setPayment] = useState({})
  const [openSlideDrawer, setOpenSlideDrawer] = useState(false);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpenSlideDrawer(!openSlideDrawer);
  };

  const { id } = useParams()
  const navigate = useNavigate()

  const { loading, error } = useQuery(ORDER_PAYMENT, {
    variables: {
      id
    },
    onCompleted: (res) => {
      setPayment(res.orderPayment)
    }
  });
  return (
    <Box maxWidth='xl'>
      {/* invoice page */}
      <SlideDrawer openSlideDrawer={openSlideDrawer} toggleDrawer={toggleDrawer}>
        <InvoiceTemplate data={payment} toggleDrawer={toggleDrawer} />
      </SlideDrawer>
      {/* <InvoiceTemplate/> */}
      <Stack direction='row' gap={2}>
        <IconButton onClick={() => navigate(- 1)}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Payment Details</Typography>
      </Stack>
      <Box mt={3}>
        <Stack direction='row' gap={2}>
          <Stack alignItems='center' sx={{
            mb: 2,
            display: 'inline-flex',
            padding: '5px 12px',
            bgcolor: 'green',
            color: '#fff',
            borderRadius: '50px',
            minWidth: '200px',
          }}>
            <Typography sx={{ fontWeight: 600 }} variant='body2'>{payment?.status}</Typography>
          </Stack>
          <Button onClick={toggleDrawer} sx={{ borderRadius: '50px', height: '32px' }} variant='outlined' startIcon={<KeyboardDoubleArrowRightOutlined />}>Invoice</Button>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' gap={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={3}>
            <Stack direction='row' gap={2}>
              <Stack alignItems='flex-end' gap={1}>
                <Typography sx={{ whiteSpace: 'nowrap' }}>Created On:</Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}>Payment Type: </Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}>Paid Amount: </Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}>Note: </Typography>
              </Stack>
              <Stack gap={1}>
                <Typography sx={{ whiteSpace: 'nowrap' }}>{payment?.createdOn && <b>{format(payment?.createdOn, 'dd-MM-yyyy')}</b>}</Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}><b>{payment?.paymentType}</b></Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}> <b>{payment?.paidAmount}</b> kr</Typography>
                <Typography sx={{ whiteSpace: 'nowrap' }}> {payment?.note}</Typography>
              </Stack>
            </Stack>
            {
              payment?.paymentFor &&
              <Stack>
                <Typography fontWeight={600}>Payment For</Typography>
                <Typography sx={{ width: 'fit-content', border: '1px solid coral', borderRadius: '4px', px: 1, color: 'coral' }}><b>{payment.paymentFor?.role}</b></Typography>
                <Typography>User Name:
                  <Link to={`/dashboard/customers/staff/details/${payment?.paymentFor?.id}`}>
                    <b>{payment.paymentFor?.username}</b>
                  </Link>
                </Typography>
                <Typography>Name: <b>{payment.paymentFor?.firstName + ' ' + payment.paymentFor?.lastName}</b></Typography>
                <Typography>Email: <b>{payment.paymentFor?.email}</b></Typography>
              </Stack>
            }
          </Stack>
          <Stack sx={{
            px: 3
          }} gap={2}>
            <Typography variant='h5'>Customer Information</Typography>
            <Stack direction='row' gap={1}>
              <Avatar src={payment?.company?.logoUrl ?? '/noImage.png'} />
              <Box>
                <Typography sx={{ fontSize: '16px' }}>Name: <b>
                  <Link to={`/dashboard/customers/details/${payment?.company?.id}`}>{payment?.company?.name}</Link>
                </b></Typography>
                <Typography sx={{ fontSize: '16px' }}>Email: <b>{payment?.company?.email}</b></Typography>
                <Typography sx={{ fontSize: '16px' }}>Contact: <b>{payment?.company?.contact}</b></Typography>
                <Typography sx={{ fontSize: '16px' }}>PostCode: <b>{payment?.company?.postCode}</b></Typography>
              </Box>
            </Stack>
          </Stack>
          {/* <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 4, md: 3, lg: 10 }}>
            <Box>
              <Typography variant='h5' mb={1}>Billing Address</Typography>
              <Typography sx={{ fontSize: '16px' }}>Address: <b>{order?.billingAddress?.address}</b></Typography>
              <Typography sx={{ fontSize: '16px' }}>First Name: <b>{order?.billingAddress?.firstName}</b></Typography>
              <Typography sx={{ fontSize: '16px' }}>Last Name: <b>{order?.billingAddress?.lastName}</b></Typography>
              <Typography sx={{ fontSize: '16px' }}>Phone: <b>{order?.billingAddress?.phone}</b></Typography>
              <Typography sx={{ fontSize: '16px' }}>Sector: <b>{order?.billingAddress?.sector}</b></Typography>
            </Box>
            <Divider sx={{ display: { xs: 'none', md: 'block' } }} orientation="vertical" />
            <Box>
              <Typography variant='h5' mb={1}>Shipping Address</Typography>
              <Typography sx={{ fontSize: '16px' }}>Address: <b>{order?.shippingAddress?.address}</b></Typography>
              <Typography sx={{ fontSize: '16px' }}>First Name: <b>{order?.shippingAddress?.fullName}</b></Typography>
              <Typography sx={{ fontSize: '16px' }}>City: <b>{order?.shippingAddress?.city}</b></Typography>
              <Typography sx={{ fontSize: '16px' }}>Phone: <b>{order?.shippingAddress?.phone}</b></Typography>
              <Typography sx={{ fontSize: '16px' }}>Post Code: <b>{order?.shippingAddress?.postCode}</b></Typography>
              {
                order?.shippingAddress?.instruction &&
                <Typography sx={{
                  fontSize: '16px',
                  border: '1px solid lightgray',
                  p: 1, mt: 1, borderRadius: '8px',
                  maxWidth: '400px'
                }}>
                  Instruction: <b>{order?.shippingAddress?.instruction}</b>
                </Typography>
              }
            </Box>
          </Stack> */}
        </Stack>
        <Divider sx={{ mt: 3 }} />

        <Stack gap={3} mt={3}>
          <Typography variant='h5'>Orders</Typography>
          {
            loading ? <LoadingBar /> : error ? <ErrorMsg /> :
              payment?.orders?.edges.length === 0 ? <Typography>No Order Found!</Typography> :
                payment?.orders?.edges.map(d => {
                  const data = d.node;
                  const orderCarts = d.node.orderCarts.edges.map(item => item.node);
                  const billingAddress = d.node.billingAddress;
                  const shippingAddress = d.node.shippingAddress;
                  return (
                    <Box sx={{
                      maxWidth: '700px',
                      boxShadow: 2,
                      border: '1px solid lightgray',
                      p: 2, borderRadius: '8px'
                    }} key={data.id}>
                      <Stack sx={{ width: '100%' }} direction='row' gap={2} justifyContent='space-between' >
                        <Box>
                          <Typography sx={{ whiteSpace: 'nowrap' }}>Delivery:<b>{data.deliveryDate}</b></Typography>
                          <Typography sx={{ whiteSpace: 'nowrap' }}>Due Amount:<b>{data.dueAmount}</b></Typography>
                          <Typography sx={{ whiteSpace: 'nowrap' }}>Total Price:<b>{data.finalPrice}</b></Typography>
                        </Box>
                        <Box>
                          <Typography sx={{
                            whiteSpace: 'nowrap',
                            px: 1, borderRadius: '4px',
                            width: 'fit-content',
                            bgcolor: data.status === 'Cancelled'
                              ? 'red'
                              : data.status === 'Confirmed'
                                ? 'lightgreen'
                                : data.status === 'Delivered'
                                  ? 'green'
                                  : data.status === 'Processing'
                                    ? '#8294C4'
                                    : data.status === 'Ready-to-deliver'
                                      ? '#01B8A9'
                                      : 'yellow',
                            color: data.status === 'Placed'
                              ? 'dark' : data.status === 'Payment-pending'
                                ? 'dark' : data.status === 'Confirmed' ? 'dark' : '#fff',
                          }}>Status:<b>{data.status}</b></Typography>
                          <Typography sx={{ whiteSpace: 'nowrap' }}>Payment Type:<b>{data.paymentType}</b></Typography>
                          {data.coupon && <Typography sx={{ whiteSpace: 'nowrap' }}>Coupon:<b style={{ backgroundColor: 'coral', color: '#fff', paddingLeft: '5px', paddingRight: '5px' }}>{data.coupon?.name}</b></Typography>}
                          {data.note && <Typography sx={{ whiteSpace: 'nowrap' }}>Note:<b>{data.note}</b></Typography>}
                        </Box>
                      </Stack>
                      <Stack gap={2} mt={2}>
                        <Typography variant='h5'>Order Carts:</Typography>
                        {
                          orderCarts?.map(data => (
                            <Box sx={{
                              border: '1px solid lightgray',
                              maxWidth: '800px',
                              borderRadius: '8px',
                              p: 1
                            }} key={data.id}>
                              <Typography>{data.date}</Typography>
                              <Typography>Quantity: {data.orderedQuantity}</Typography>
                              <Typography>Total Price (tax): {data.totalPriceWithTax}</Typography>
                              <Typography>Due: {data.dueAmount} kr</Typography>
                              {data.cancelled !== 0 &&
                                <Typography>Cancelled: {data.cancelled}</Typography>
                              }
                              {data.vendor &&
                                <Typography>Vendor:
                                  <Link to={`/dashboard/suppliers/details/${data.vendor.id}`}>
                                    {data.vendor.name}
                                  </Link>
                                </Typography>
                              }
                              <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 0, md: 2 }} alignItems={{ xs: 'start', md: 'center' }} justifyContent='space-between'>
                                <Stack direction={{ xs: 'row', md: 'row' }} gap={{ xs: 0, md: 1 }} alignItems='center'>
                                  <img style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    margin: '10px',
                                    border: '1px solid lightgray'
                                  }} src={data?.item?.attachments?.edges?.find(item => item.node.isCover)?.node.fileUrl ?? "/noImage.png"} alt="" />
                                  <Box mb={{ xs: 0, md: 2 }}>
                                    <Typography sx={{ fontSize: { xs: '14', md: '18px' }, fontWeight: 600 }}>{data?.item?.name}</Typography>
                                    <Typography variant='body2'>Category: <b>{data?.item?.category?.name}</b></Typography>
                                    <Typography>Price: <b>{data?.item?.priceWithTax}</b> kr</Typography>
                                  </Box>
                                </Stack>
                                {/* <Stack gap={.5} mr={2}>
                                <Typography>Quantity: <b>{data?.node.orderedQuantity}</b> </Typography>
                                <Typography>Total Price: <b>{data?.node.totalPriceWithTax}</b> kr</Typography>
                              </Stack> */}
                              </Stack>
                            </Box>
                          ))
                        }
                      </Stack>


                    </Box>
                  )
                })
          }
        </Stack>

      </Box >
    </Box >
  )
}

export default PaymentDetails