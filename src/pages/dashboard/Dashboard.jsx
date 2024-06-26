/* eslint-disable react/prop-types */
import { AccountBalanceWalletOutlined, AddShoppingCartOutlined, ArrowUpward, PeopleAltOutlined, ShoppingBasket, ShoppingBasketOutlined } from '@mui/icons-material'
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useState } from 'react';
import { deleteFile } from '../../utils/deleteFile';
import { useQuery } from '@apollo/client';
import { ADMIN_DASHBOARD } from './graphql/query';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import RecentOrders from './RecentOrders';
import RecentCustomers from './RecentCustomers';
import SoldProducts from './SoldProducts';
import Users from './Users';

const boxStyle = {
  box: {
    minWidth: '300px',
    border: '1px solid lightgray',
    p: 2, borderRadius: '8px'
  },
  title: {
    fontSize: '14px', fontWeight: 600, mb: 1
  },
  value: {
    display: 'inline-flex',
    gap: '10px',
    fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600
  }
}

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('')
  const [data, setData] = useState({})

  const { loading, error } = useQuery(ADMIN_DASHBOARD, {
    variables: {
      dateRange
    },
    onCompleted: (res) => {
      setData(res.adminDashboard.data)
    }
  });

  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Welcome , Lunsjavtale</Typography>
      {
        loading ? <Loader /> : error ? <ErrorMsg /> :
          <Stack gap={3}>
            <Stack direction='row' justifyContent='space-between' sx={{ minWidth: 200, mt: 2 }}>
              <Box />
              <FormControl sx={{ minWidth: '200px' }} size='small'>
                <InputLabel>Status</InputLabel>
                <Select
                  value={dateRange}
                  label="Status"
                  onChange={e => setDateRange(e.target.value)}
                >
                  <MenuItem value={'last-7-days'}>Last 7 days </MenuItem>
                  <MenuItem value={'last-30-days'}>Last 30 days</MenuItem>
                  <MenuItem value={'last-6-months'}>Last 6 months</MenuItem>
                  <MenuItem value={'last-12-months'}>Last 12 months</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={3}>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Sales Today </Typography>
                <Typography sx={boxStyle.value}>
                  <ShoppingBasketOutlined fontSize='large' />
                  {data?.salesToday}
                  <span>kr</span>
                </Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Total Orders </Typography>
                <Typography sx={boxStyle.value}><AddShoppingCartOutlined fontSize='large' />{data?.totalOrders}</Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Total Sales </Typography>
                <Typography sx={boxStyle.value}>
                  <AccountBalanceWalletOutlined fontSize='large' />
                  {data?.totalSales}
                  <span>kr</span>
                </Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Total Customers </Typography>
                <Typography sx={boxStyle.value}> <PeopleAltOutlined fontSize='large' /> {data?.totalCustomers}</Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
              <Box sx={{ width: { xs: '100%', lg: '60%' } }}>
                <RecentOrders data={data} />
              </Box>
              <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                <RecentCustomers data={data} />
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
              <Box sx={{ width: { xs: '100%', lg: '60%' } }}>
                <SoldProducts data={data} />
              </Box>
              <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                <Users data={data} />
              </Box>
            </Stack>

          </Stack>
      }
    </Box>
  )
}

export default Dashboard