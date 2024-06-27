/* eslint-disable react/prop-types */
import { ArrowForwardIos, KeyboardArrowRight, StoreOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataTable from '../../common/datatable/DataTable';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const RecentCustomers = ({ data }) => {
  const [recentCustomers, setRecentCustomers] = useState([])

  const columns = [
    {
      field: 'companyName', headerName: '', flex: 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Company</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%',py:.5 }} direction='row' gap={1} alignItems='center'>
          {params.row.logoUrl ? <Avatar sx={{ borderRadius: '4px' }} src={params.row.logoUrl} /> :
            <StoreOutlined sx={{ color: params.row.isValid ? 'inherit' : 'darkgray' }} />}
          <Stack>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.name}</Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.email}</Typography>
          </Stack>
        </Stack>
      )
    },
  ];


  const rows = recentCustomers?.map(item => ({
    id: item.pk,
    contact: item.fields.contact,
    email: item.fields.email,
    name: item.fields.name,
  }))


  useEffect(() => {
    setRecentCustomers(data.recentCustomers)
  }, [data])



  return (
    <Box sx={{
      border: '1px solid lightgray',
      p: 2, borderRadius: '8px'
    }}>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h5'>Recent Customers</Typography>
        <Link to='/dashboard/customers'>
          <Button sx={{whiteSpace:'nowrap'}} endIcon={<KeyboardArrowRight />}>All Customers</Button>
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

export default RecentCustomers