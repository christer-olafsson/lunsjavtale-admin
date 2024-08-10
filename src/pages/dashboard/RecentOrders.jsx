/* eslint-disable react/prop-types */
import { ArrowForwardIos, KeyboardArrowRight } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataTable from '../../common/datatable/DataTable';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const RecentOrders = ({ data }) => {
  const [recentOrders, setRecentOrders] = useState([])

  const columns = [
    {
      field: 'orderDate', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Order Date</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{format(params.row.createdOn, 'dd-MM-yyyy')}</Typography>
          </Stack>
        )
      }
    },

    {
      field: 'deliveryDate', headerName: 'Prce', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Delivery Date</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            {params.row.deliveryDate}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'totalPrice', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Total Price</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            <span style={{ fontWeight: 400 }}>kr </span>
            {params.row?.finalPrice}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'status', headerName: 'Status', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Box sx={{
            display: 'inline-flex',
            padding: '1px 12px',
            bgcolor: row.status === 'Cancelled'
              ? 'red'
              : row.status === 'Confirmed'
                ? 'lightgreen'
                : row.status === 'Delivered'
                  ? 'green'
                  : row.status === 'Processing'
                    ? '#8294C4'
                    : row.status === 'Payment-completed'
                      ? 'blue'
                      : row.status === 'Ready-to-deliver'
                        ? '#01B8A9'
                        : 'yellow',
            color: row.status === 'Placed'
              ? 'dark' : row.status === 'Payment-pending'
                ? 'dark' : row.status === 'Confirmed' ? 'dark' : '#fff',
            borderRadius: '4px',
          }}>
            <Typography sx={{ fontWeight: 500 }} variant='body2'>{row.status}</Typography>
          </Box>
        )
      }
    },
  ];


  const rows = recentOrders?.map(item => ({
    id: item.pk,
    deliveryDate: item.fields.delivery_date,
    finalPrice: item.fields.final_price,
    createdOn: item.fields.created_on,
    status: item.fields.status
  }))


  useEffect(() => {
    setRecentOrders(data.recentOrders)
  }, [data])



  return (
    <Box sx={{
      border: '1px solid lightgray',
      p: 2, borderRadius: '8px',
      boxShadow: 2
    }}>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h5'>Recent Orders</Typography>
        <Link to='/dashboard/orders'>
          <Button endIcon={<KeyboardArrowRight />}>See All Orders</Button>
        </Link>
      </Stack>

      <Box mt={3}>
        <DataGrid
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 4,
              },
            },
          }}
          pageSizeOptions={[4]}
          columns={columns}
          rows={rows ?? []}
        />
      </Box>
    </Box>
  )
}

export default RecentOrders