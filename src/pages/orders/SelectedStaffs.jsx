/* eslint-disable react/prop-types */
import { Add, Close, MailOutline, ModeEdit, PhoneOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { useQuery } from '@apollo/client';
import DataTable from '../../common/datatable/DataTable';

const SelectedStaffs = ({ data, closeDialog }) => {
  // const [rows, setRows] = useState([])

  const columns = [
    {
      field: 'users',
      headerName: 'Users',
      width: 300,
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack direction='row' gap={1} alignItems='center'>
            <Avatar src={row?.photoUrl ? row.photoUrl : ''} />
            <Box>
              <Typography sx={{ fontSize: '16px' }}>{row.firstName + row.lastName}</Typography>
              <Stack direction='row' alignItems='center' gap={2}>
                <Typography sx={{ fontSize: '12px' }}>@{row.username}</Typography>
                <Typography sx={{
                  fontSize: '12px',
                  bgcolor: row.role === 'company-manager' ? 'primary.main' : row.role === 'company-owner' ? 'purple' : 'lightgray',
                  px: 1, borderRadius: '50px',
                  color: row.role === 'company-manager' ? '#fff' : row.role === 'company-owner' ? '#fff' : 'inherit',
                }}>{row.role.replace('company-', '')}</Typography>
              </Stack>
            </Box>
          </Stack>
        )
      }
    },
    {
      field: 'info', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Info</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} gap={.5} >
            <Typography sx={{ fontSize: { xs: '12px', md: '14px' }, display: 'inline-flex' }}>
              <MailOutline sx={{ mr: .5 }} fontSize='small' /> {params.row.email}
            </Typography>
            <Typography sx={{ fontSize: { xs: '12px', md: '14px' }, display: 'inline-flex' }}>
              <PhoneOutlined sx={{ mr: .5 }} fontSize='small' />{params.row.phone}
            </Typography>
          </Stack>
        )
      }
    },
    {
      field: 'dueAmount', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Due Amount</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ color: 'coral', fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
              {params.row.dueAmount} kr
            </Typography>
          </Stack>
        )
      }
    },
  ];

  const rows = data?.users?.edges.map(item => {
    const user = item?.node.addedFor;
    return ({
      id: item?.node.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.username,
      phone: user?.phone,
      email: user?.email,
      dueAmount: item?.node?.dueAmount,
      photoUrl: user?.photoUrl,
      role: user?.role,
    })
  }).sort((a, b) => {
    if (a.role === 'company-owner') return -1;
    if (b.role === 'company-owner') return 1;
    if (a.role === 'company-manager') return -1;
    if (b.role === 'company-manager') return 1;
    return 0;
  })



  return (
    <Box>
      <Typography variant='h5' my={3}>Selected Staffs</Typography>

      <Box>
        <DataTable
          rows={rows}
          columns={columns}
        />
      </Box>

    </Box>
  )
}

export default SelectedStaffs