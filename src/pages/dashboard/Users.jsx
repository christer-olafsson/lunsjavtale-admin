/* eslint-disable react/prop-types */
import { ArrowForwardIos, KeyboardArrowRight, StoreOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataTable from '../../common/datatable/DataTable';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const Users = ({ data }) => {
  const [users, setUsers] = useState([])

  const columns = [
    {
      field: 'users', headerName: '', flex: 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>System Users</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', py: .5 }} direction='row' gap={1} alignItems='center'>
          <Avatar />
          <Stack>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{(params.row.firstName ?? '') + ' ' + (params.row.lastName ?? '')}</Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.email}</Typography>
          </Stack>
        </Stack>
      )
    },
  ];


  const rows = users?.map(item => ({
    id: item.pk,
    firstName: item.fields.first_name,
    lastName: item.fields.last_name,
    email: item.fields.email,
    role: item.fields.role,
  }))


  useEffect(() => {
    setUsers(data.users)
  }, [data])



  return (
    <Box sx={{
      border: '1px solid lightgray',
      p: 2, borderRadius: '8px',
      boxShadow: 2
    }}>
      <Typography variant='h5'>Users</Typography>

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

export default Users