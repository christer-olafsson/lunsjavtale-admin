/* eslint-disable react/prop-types */
import { ArrowForwardIos, KeyboardArrowRight } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataTable from '../../common/datatable/DataTable';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const SoldProducts = ({ data }) => {
  const [soldProducts, setSoldProducts] = useState([])

  const columns = [
    {
      field: 'name', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Name</Typography>
      ),
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>{params.row.name}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'soldAmount', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Sold Amount</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: { xs: '12px', md: '16px' }, fontWeight: 600 }}>
            <span style={{ fontWeight: 400 }}>kr </span>
            {params.row?.soldAmount}
          </Typography>
        </Stack>
      )
    }
  ];



  useEffect(() => {
    setSoldProducts(data.soldProducts)
  }, [data])



  return (
    <Box sx={{
      border: '1px solid lightgray',
      p: 2, borderRadius: '8px',
      boxShadow: 2
    }}>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h5'>Sold Products </Typography>
        <Link to='/dashboard/orders'>
          <Button endIcon={<KeyboardArrowRight />}>See All</Button>
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
          rows={soldProducts ?? []}
        />
      </Box>
    </Box>
  )
}

export default SoldProducts