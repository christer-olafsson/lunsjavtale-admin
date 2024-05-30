import { ArrowRight, BorderColor, Search, TrendingFlat } from '@mui/icons-material'
import { Box, Button, IconButton, Input, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ORDERS } from './graphql/query';
import { format } from 'date-fns';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import DataTable from '../../common/datatable/DataTable';

const Orders = () => {
  const [orders, setOrders] = useState([])

  const navigate = useNavigate()

  const { loading, error: orderErr } = useQuery(ORDERS, {
    fetchPolicy:'cache-and-network',
    // notifyOnNetworkStatusChange: true,
    // variables: {
    //   addedFor: '141'
    // },
    onCompleted: (res) => {
      setOrders(res.orders.edges.map(item => item.node));
    }
  });


  function handleEdit(row) {
    navigate(`/dashboard/orders/edit/${row.id}`)
  }

  const columns = [
    {
      field: 'details', headerName: '', width: 150,
      renderCell: (params) => (
        <Link to={`/dashboard/orders/details/${params.row.id}`}>
          <Button endIcon={<ArrowRight />} size='small'>Details</Button>
        </Link>
      ),
    },
    {
      field: 'orderDate', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{format(params.row.orderDate, 'yyyy-MM-dd')}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'deliveryDate', headerName: 'Prce', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Delivery Date</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            {format(params.row.deliveryDate, 'yyyy-MM-dd')}
          </Typography>
        </Stack>
      )
    },

    // {
    //   field: 'orderDetails', width: 250,
    //   renderHeader: () => (
    //     <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order Details</Typography>
    //   ),
    //   renderCell: (params) => {
    //     const { row } = params;
    //     return (
    //       <Stack direction='row' gap={2}>
    //         <img style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', padding: '5px' }} src={row.fileUrl ?? ''} alt="" />
    //         <Box>
    //           <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 600 }}>{row.name}</Typography>
    //           <Typography sx={{ fontSize: { xs: '12px', md: '14px' } }}>kr {row.priceWithTax} <b>x{row.quantity}</b> </Typography>
    //         </Box>
    //       </Stack>
    //     )
    //   }
    // },
    // { field: 'paymentInfo', headerName: 'Payment Info', width: 150 },
    {
      field: 'totalPrice', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Total Price</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            <span style={{ fontWeight: 400 }}>kr </span>
            {params.row.totalPrice}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'status', headerName: 'Status', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{
          display: 'inline-flex',
          padding: '4px 12px',
          bgcolor: params.row.status === 'Placed' ? '#40A578' : '#E9EDFF',
          color: params.row.status === 'Placed' ? '#fff' : 'inherit',
          borderRadius: '4px',
        }}>
          <Typography variant='body2'>{params.row.status}</Typography>
        </Box>
      ),
    },
    // {
    //   field: 'action', headerName: 'Action', width: 150,
    //   renderHeader: () => (
    //     <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Action</Typography>
    //   ),
    //   renderCell: (params) => {
    //     return (
    //       <IconButton sx={{
    //         bgcolor: 'light.main',
    //         borderRadius: '5px',
    //         width: { xs: '30px', md: '40px' },
    //         height: { xs: '30px', md: '40px' },
    //       }} onClick={() => handleEdit(params.row)}>
    //         <BorderColor fontSize='small' />
    //       </IconButton>
    //     )
    //   },
    // },
  ];

  const rows = orders.map(item => {
    const orderCart = item.orderCarts.edges[0]?.node
    return {
      id: item.id,
      orderDate: item.createdOn,
      // name: orderCart.item.name,
      // quantity: orderCart.quantity,
      // priceWithTax: orderCart.priceWithTax,
      totalPrice: item.finalPrice,
      status: item.status,
      deliveryDate: item.deliveryDate,
      // fileUrl: orderCart.item.attachments.edges.find(item => item.node.isCover)?.node.fileUrl,
    }
  })


  return (
    <Box maxWidth='xxl'>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Order History</Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '480px',
          bgcolor: '#fff',
          width: '100%',
          border: '1px solid lightgray',
          borderRadius: '4px',
          pl: 2
        }}>
          <Input fullWidth disableUnderline placeholder='Search Order Id' />
          <IconButton><Search /></IconButton>
        </Box>
      </Stack>
      <Box mt={3}>
        {
          loading ? <Loader /> : orderErr ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={rows}
            />
        }
      </Box>
    </Box>
  )
}

export default Orders