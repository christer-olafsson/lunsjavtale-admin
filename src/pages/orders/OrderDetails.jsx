import { Add, ArrowBack, ArrowDropDown } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, Collapse, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ORDER } from './graphql/query';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import SelectedStaffs from './SelectedStaffs';
import { format } from 'date-fns';
import { ORDER_STATUS_UPDATE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import LoadingBar from '../../common/loadingBar/LoadingBar';


const OrderDetails = () => {
  const [order, setOrder] = useState([]);
  const [selectedStaffDetailsId, setSelectedStaffDetailsId] = useState('')
  const [errors, setErrors] = useState({});
  const [orderStatus, setOrderStatus] = useState('')

  const { id } = useParams()
  const navigate = useNavigate()

  const [fetchOrder, { loading, error: orderErr }] = useLazyQuery(ORDER, {
    fetchPolicy: 'network-only',
    variables: {
      id,
    },
    onCompleted: (res) => {
      setOrder(res.order)
    },
  });
  const [orderStatusUpdate, { loading: statusLoading }] = useMutation(ORDER_STATUS_UPDATE, {
    onCompleted: (res) => {
      fetchOrder()
      toast.success(res.orderStatusUpdate.message)
    },
    onError: (err) => {
      toast.error(err.message)
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          setErrors(extensions.errors)
        }
      }
    }
  });
  console.log(order)

  const handleUpdate = () => {
    if (orderStatus === 'Placed') {
      setErrors({ status: 'Status required!' })
      toast.error('Order Status Required!')
      return
    }
    orderStatusUpdate({
      variables: {
        id: order.id,
        status: orderStatus
      }
    })
  }


  const handleSelectedStaffsDetails = (data) => {
    if (selectedStaffDetailsId) {
      setSelectedStaffDetailsId('')
    } else {
      setSelectedStaffDetailsId(data.id)

    }
  }

  useEffect(() => {
    setOrderStatus(order?.status ?? '')
  }, [order])


  useEffect(() => {
    fetchOrder()
  }, [])


  return (
    <Box maxWidth='xl'>
      <Stack direction='row' gap={2}>
        <IconButton onClick={() => navigate(- 1)}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Order Details</Typography>
      </Stack>
      <Box mt={3}>
        {
          order?.status &&
          <Stack alignItems='center' sx={{
            mb: 2,
            display: 'inline-flex',
            padding: '5px 12px',
            bgcolor: order.status === 'Cancelled'
              ? 'red'
              : order.status === 'Confirmed'
                ? 'lightgreen'
                : order.status === 'Delivered'
                  ? 'green'
                  : order.status === 'Processing'
                    ? '#8294C4'
                    : order.status === 'Ready-to-deliver'
                      ? '#01B8A9'
                      : 'yellow',
            color: order?.status === 'Placed'
              ? 'dark' : order?.status === 'Payment-pending'
                ? 'dark' : order?.status === 'Confirmed' ? 'dark' : '#fff',
            borderRadius: '50px',
            minWidth: '200px',
          }}>
            <Typography sx={{ fontWeight: 600 }} variant='body2'>{order?.status}</Typography>
          </Stack>
        }
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' gap={3}>
          <Stack direction='row' gap={2}>
            <Stack alignItems='flex-end' gap={1}>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Created On:</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Delivery Date: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Payment Type: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Discount Amount: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Company Allowance: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Due Amount: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Paid Amount: </Typography>
              <Typography>Coupon: </Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Total Price: </Typography>
            </Stack>
            <Stack gap={1}>
              <Box >
                {
                  order?.createdOn &&
                  <Typography sx={{ whiteSpace: 'nowrap' }}>
                    <b>{format(order?.createdOn, 'dd-MM-yyyy')}</b>
                    <span style={{ fontSize: '13px', marginLeft: '5px' }}>{format(order?.createdOn, 'HH:mm')}</span>
                  </Typography>
                }
              </Box>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{order?.deliveryDate}</b></Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{order?.paymentType}</b></Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{order?.discountAmount}</b> kr</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{order?.companyAllowance}</b> %</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}><b>{order?.dueAmount}</b> kr</Typography>
              <Typography sx={{ whiteSpace: 'nowrap' }}> <b>{order?.paidAmount}</b> kr</Typography>
              <Typography sx={{ bgcolor: 'yellow', width: 'fit-content', whiteSpace: 'nowrap' }}>{order?.coupon && <b> {order?.coupon?.name}</b>}</Typography>
              <Typography><b>{order?.finalPrice}</b> kr</Typography>
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 4, md: 3, lg: 10 }}>
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
          </Stack>
        </Stack>
        <Stack sx={{ maxWidth: '300px' }} direction='row' gap={2} my={2}>
          <FormControl size='small' fullWidth>
            <InputLabel>Order Status</InputLabel>
            <Select
              disabled={order?.status === 'Cancelled' || order?.status === 'Delivered'}
              label="Order Status"
              error={Boolean(errors.status)}
              value={orderStatus}
              onChange={e => setOrderStatus(e.target.value)}
            >
              <MenuItem value={'Confirmed'}>Confirmed </MenuItem>
              <MenuItem value={'Processing'}>Processing </MenuItem>
              <MenuItem value={'Ready-to-deliver'}>Ready to deliver </MenuItem>
              <MenuItem value={'Delivered'}>Delivered </MenuItem>
              <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
            </Select>
          </FormControl>
          <CButton disable={order?.status === 'Cancelled' || order?.status === 'Delivered'} onClick={handleUpdate} isLoading={statusLoading} variant='contained'>Apply</CButton>
        </Stack>
        <Divider sx={{ mt: 3 }} />

        <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent='space-between' mt={3} gap={6}>

          <Stack gap={3}>
            {
              loading ? <LoadingBar /> : orderErr ? <ErrorMsg /> :
                !order?.orderCarts?.edges ? <Typography>Not Found!</Typography> :
                  order?.orderCarts?.edges.map(data => (
                    <Stack key={data.node.id}>

                      <Stack sx={{
                        border: '1px solid lightgray',
                        maxWidth: '800px',
                        borderRadius: '8px',
                        p: 1
                      }} direction={{ xs: 'column', md: 'row' }} gap={{ xs: 0, md: 2 }} alignItems={{ xs: 'start', md: 'center' }} justifyContent='space-between'>
                        <Stack direction={{ xs: 'row', md: 'row' }} gap={{ xs: 0, md: 1 }} alignItems='center'>
                          <img style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            margin: '10px',
                            border: '1px solid lightgray'
                          }} src={data?.node.item.attachments?.edges.find(item => item.node.isCover)?.node.fileUrl ?? "/noImage.png"} alt="" />
                          <Box mb={{ xs: 0, md: 2 }}>
                            <Typography sx={{ fontSize: { xs: '14', md: '18px' }, fontWeight: 600 }}>{data?.node.item.name}</Typography>
                            <Typography variant='body2'>Category: <b>{data?.node.item.category.name}</b></Typography>
                            <Typography>Price: <b>{data?.node.item.priceWithTax}</b> kr</Typography>
                            <Typography>Ingredients: </Typography>
                            {
                              data?.node.item.ingredients?.edges &&
                              data?.node.item.ingredients?.edges.map(item => (
                                <ul key={item.node.id}>
                                  <li>{item.node.name}</li>
                                </ul>
                              ))
                            }
                            {
                              data?.node.item.vendor &&
                              <Stack direction='row' gap={1}>
                                <Typography>Supplier: </Typography>
                                <Link to={`/dashboard/suppliers/details/${data?.node.item.vendor?.id}`}>
                                  {data?.node.item.vendor?.name}
                                </Link>
                              </Stack>
                            }
                          </Box>
                        </Stack>
                        <Stack gap={.5} mr={2}>
                          <Typography>Quantity: <b>{data?.node.orderedQuantity}</b> </Typography>
                          <Typography>Total Price: <b>{data?.node.totalPriceWithTax}</b> kr</Typography>
                          <Button sx={{ whiteSpace: 'nowrap' }} onClick={() => handleSelectedStaffsDetails(data.node)} variant='outlined' size='small' endIcon={<ArrowDropDown />}>
                            Selected Staffs ({data?.node.users?.edges?.length})
                          </Button>
                        </Stack>
                      </Stack>
                      <Collapse in={selectedStaffDetailsId === data.node.id}>
                        <SelectedStaffs users={data?.node.users?.edges} />
                      </Collapse>
                    </Stack>
                  ))
            }
          </Stack>
          <Stack sx={{
            px: 3
          }} gap={2}>
            <Typography variant='h5'>Customer Information</Typography>
            <Stack direction='row' gap={1}>
              <Avatar src={order?.company?.logoUrl ?? '/noImage.png'} />
              <Box>
                <Typography sx={{ fontSize: '16px' }}>Name: <b>
                  <Link to={`/dashboard/customers/details/${order?.company?.id}`}>{order?.company?.name}</Link>
                </b></Typography>
                <Typography sx={{ fontSize: '16px' }}>Email: <b>{order?.company?.email}</b></Typography>
                <Typography sx={{ fontSize: '16px' }}>Contact: <b>{order?.company?.contact}</b></Typography>
                <Typography sx={{ fontSize: '16px' }}>PostCode: <b>{order?.company?.postCode}</b></Typography>
              </Box>
            </Stack>
          </Stack>

        </Stack>

      </Box >
    </Box >
  )
}

export default OrderDetails