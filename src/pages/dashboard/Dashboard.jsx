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
    minWidth: '250px',
    maxWidth: '450px',
    flex: 1,
    border: '1px solid lightgray',
    p: 2, borderRadius: '8px',
    boxShadow: 2
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
    <Box maxWidth='xl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Welcome , Lunsjavtale</Typography>
      {
        loading ? <Loader /> : error ? <ErrorMsg /> :
          <Stack gap={3}>
            <FormControl sx={{ maxWidth: '200px', mt: 2 }} size='small'>
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
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2} flexWrap='wrap'>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Sales Today </Typography>
                <Typography sx={boxStyle.value}>
                  <ShoppingBasketOutlined sx={{ bgcolor: 'green', borderRadius: '50px', p: 1, fontSize: '40px', color: '#fff' }} />
                  {data?.salesToday}
                  <span>kr</span>
                </Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Total Orders </Typography>
                <Typography sx={boxStyle.value}>
                  <AddShoppingCartOutlined sx={{ bgcolor: '#7C74EA', borderRadius: '50px', p: 1, fontSize: '40px', color: '#fff' }} />
                  {data?.totalOrders}
                </Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Total Due </Typography>
                <Typography sx={boxStyle.value}>
                  <AddShoppingCartOutlined sx={{ bgcolor: 'coral', borderRadius: '50px', p: 1, fontSize: '40px', color: '#fff' }} />
                  {data?.totalDue} <span style={{ fontSize: '16px' }}>kr</span>
                </Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Total Sales </Typography>
                <Typography sx={boxStyle.value}>
                  <AccountBalanceWalletOutlined sx={{ bgcolor: '#6489F2', borderRadius: '50px', p: 1, fontSize: '40px', color: '#fff' }} />
                  {data?.totalSales}
                  <span style={{ fontSize: '16px' }}>kr</span>
                </Typography>
              </Box>
              <Box sx={boxStyle.box}>
                <Typography sx={boxStyle.title}>Total Customers </Typography>
                <Typography sx={boxStyle.value}> <PeopleAltOutlined sx={{ bgcolor: '#E46698', borderRadius: '50px', p: 1, fontSize: '40px', color: '#fff' }} />
                  {data?.totalCustomers}
                </Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
              <Box sx={{ width: { xs: '100%', lg: '70%' } }}>
                <RecentOrders data={data} />
              </Box>
              <Box sx={{ width: { xs: '100%', lg: '30%' } }}>
                <RecentCustomers data={data} />
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
              <Box sx={{ width: { xs: '100%', lg: '70%' } }}>
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