import { Add, ArrowBack, ArrowDropDown } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ORDER } from './graphql/query';
import { useQuery } from '@apollo/client';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import SelectedStaffs from './SelectedStaffs';
import { format } from 'date-fns';


const OrderDetails = () => {
  const [order, setOrder] = useState([]);
  const [selectedStaffDetailsId, setSelectedStaffDetailsId] = useState('')

  const { id } = useParams()

  const { loading, error: orderErr } = useQuery(ORDER, {
    variables: {
      id,
    },
    onCompleted: (res) => {
      setOrder(res.order)
    },
  });

  const handleSelectedStaffsDetails = (data) => {
    if (selectedStaffDetailsId) {
      setSelectedStaffDetailsId('')
    } else {
      setSelectedStaffDetailsId(data.id)

    }
  }
  console.log(order)
  const navigate = useNavigate()

  return (
    <Box>
      <Stack direction='row' gap={2}>
        <IconButton onClick={() => navigate(- 1)}>
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Order Details</Typography>
      </Stack>
      <Box mt={3}>
        <Stack direction='row' justifyContent='space-between'>
          <Stack gap={1}>
            {
              order.createdOn &&
              <Typography><b>Order Placed: </b>
                {format(order?.createdOn, 'yyyy-MM-dd')}
                <span style={{ fontSize: '13px', marginLeft: '5px' }}>{format(order?.createdOn, 'HH:mm')}</span>
              </Typography>
            }
            <Typography><b>Delivery Date: </b> {order?.deliveryDate}</Typography>
            <Typography><b>Payment Type: </b> {order?.paymentType}</Typography>
            <Typography><b>Discount Amount: </b> {order?.discountAmount} kr</Typography>
            <Typography><b>Company Allowance: </b> {order?.companyAllowance}%</Typography>
            <Typography><b>Due Amount: {order?.dueAmount}</b> kr</Typography>
            <Typography><b>Paid Amount: {order?.paidAmount}</b> kr</Typography>
            {
              order?.coupon &&
              <Typography sx={{ bgcolor: 'yellow', width: 'fit-content' }}><b>Coupon: {order?.coupon?.name}</b></Typography>
            }
            <Typography><b>Total Price: {order?.finalPrice}</b> kr</Typography>
            <Stack>
              <Chip label={`Status: ${order?.status}`} color='primary' variant='outlined' />
            </Stack>
          </Stack>
          <Stack sx={{
            px: 3
          }} gap={2}>
            <Typography variant='h5'>Customer Information</Typography>
            <Avatar src={order?.company?.logoUrl ?? '/noImage.png'} />
            <Typography sx={{ fontSize: '16px' }}>Name: <b>{order?.company?.name}</b></Typography>
            <Typography sx={{ fontSize: '16px' }}>email: <b>{order?.company?.email}</b></Typography>
            <Typography sx={{ fontSize: '16px' }}>contact: <b>{order?.company?.contact}</b></Typography>
            <Typography sx={{ fontSize: '16px' }}>postCode: <b>{order?.company?.postCode}</b></Typography>

          </Stack>
        </Stack>
        <Divider sx={{ mt: 2 }} />

        <Stack direction={{ xs: 'column', lg: 'row' }} mt={3} gap={6}>


          <Box sx={{ flex: 2 }}>
            <Stack gap={3}>
              {
                loading ? <Loader /> : orderErr ? <ErrorMsg /> :
                  order?.orderCarts?.edges.map(data => (
                    <Stack key={data.node.id}>

                      <Stack sx={{
                        border: '1px solid lightgray',
                        maxWidth: '800px',
                        borderRadius: '8px'
                      }} direction='row' gap={2} alignItems='center' justifyContent='space-between'>
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
                          <Button onClick={() => handleSelectedStaffsDetails(data.node)} variant='outlined' size='small' endIcon={<ArrowDropDown />}>
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

          </Box>

        </Stack>

      </Box >
    </Box >
  )
}

export default OrderDetails