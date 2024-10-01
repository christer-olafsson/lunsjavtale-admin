import { useQuery } from '@apollo/client'
import { Lock, LockOutlined, West } from '@mui/icons-material'
import { Avatar, Box, Chip, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import { VENDOR } from './graphql/query'
import { format } from 'date-fns'
import SupplierProductCard from './SupplierProductCard'

const SupplierDetails = () => {
  const [vendor, setVendor] = useState({})

  const { id } = useParams()
  const navigate = useNavigate()

  const { loading: vendorLoading, error: vendorErr } = useQuery(VENDOR, {
    variables: {
      id
    },
    onCompleted: (res) => {
      setVendor(res.vendor)
    },
  });

  return (
    <Box maxWidth='xl'>
      <Stack direction='row' alignItems='center' gap={2} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <West />
        </IconButton>
        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Supplier Details</Typography>
      </Stack>


      <Box mt={3}>
        <Stack direction={{ xs: 'column', lg: 'row' }} mt={3} gap={6}>
          <Box sx={{ width: '100%' }}>
            <Stack gap={3}>
              <Box>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between'>
                  <Stack direction='row' gap={3} mb={5} alignItems='center'>
                    <img style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }} src={vendor?.logoUrl ? vendor?.logoUrl : "/noImage.png"} alt=""
                    />
                    <Box>
                      {
                        vendor?.isDeleted &&
                        <Chip label='Deleted' color='warning' />
                      }
                      {
                        vendor?.isBlocked &&
                        <LockOutlined color='warning' />
                      }
                      {
                        vendor.createdOn &&
                        <Typography>Joined: <b>{format(vendor?.createdOn, 'dd-MM-yyyy')}</b> </Typography>
                      }
                      <Typography sx={{ display: 'inline-flex', gap: 1 }}>Name: <b>{vendor?.name}</b> <LockOutlined sx={{
                        display: vendor.isBlocked ? 'block' : 'none',
                        color: 'red'
                      }} /> </Typography>
                      <Typography>Email: <b>{vendor?.email}</b> </Typography>
                      <Typography>Contact: <b>{vendor?.contact}</b> </Typography>
                      <Typography>Post Code: <b>{vendor?.postCode}</b> </Typography>
                    </Box>
                  </Stack>
                  <Stack gap={2}>
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      bgcolor: vendor?.balance === '0.00' ? 'lightgray' : '#F7DCD9',
                      color: vendor?.balance === '0.00' ? 'inherit' : 'red',
                      borderRadius: '4px',
                      textAlign: 'center',
                      p: 1
                    }}>
                      <i>Total Due: </i>
                      {vendor?.balance ?? '00'} <span style={{ fontWeight: 400 }}>kr</span>
                    </Typography>
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      bgcolor: 'primary.main',
                      color: '#fff',
                      borderRadius: '4px',
                      textAlign: 'center',
                      p: 1
                    }}>
                      <i>Sold Amount: </i>
                      {vendor?.soldAmount ?? '00'} <span style={{ fontWeight: 400 }}>kr</span>
                    </Typography>
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      bgcolor: 'green',
                      color: '#fff',
                      borderRadius: '4px',
                      textAlign: 'center',
                      p: 1
                    }}>
                      <i>Withdrawn Amount: </i>
                      {vendor?.withdrawnAmount ?? '00'} <span style={{ fontWeight: 400 }}>kr</span>
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            <Typography my={3} variant='h5'>All Products</Typography>
            <Divider />

            <Stack direction={{ xs: 'column-reverse', md: 'row' }} gap={2} justifyContent='space-between'>
              <Stack direction='row' flexWrap='wrap' gap={2} mt={3}>
                {
                  vendorLoading ? <Loader /> : vendorErr ? <ErrorMsg /> :
                    vendor?.products?.edges.filter(item => !item.node.isDeleted).length === 0 ? <Typography>No products found</Typography> :
                      vendor?.products?.edges.filter(item => !item.node.isDeleted).map(item => (
                        <SupplierProductCard key={item.node.id} data={item.node} />
                      ))
                }
              </Stack>
              <Box>
                <Typography variant='h5' sx={{ my: 2, fontWeight: 600 }}>Owner Information</Typography>
                <Avatar sx={{ mb: 1 }} src={vendor?.owner?.photoUrl} alt="" />
                <Typography>Name: <b>{vendor?.owner?.firstName}</b> </Typography>
                <Typography>Email: <b>{vendor?.owner?.email}</b> </Typography>
                <Typography>Phone: <b>{vendor?.owner?.phone}</b> </Typography>
                <Typography>Gender: <b>{vendor?.owner?.gender}</b> </Typography>
                <Typography>Birth Date: <b>{vendor?.owner?.dateOfBirth}</b> </Typography>
                <Typography>Address: <b>{vendor?.owner?.address}</b> </Typography>
              </Box>
            </Stack>

          </Box>

          {/* <Stack gap={2} sx={{
            width: { xs: '100%', md: '30%' },
            px: { xs: 0, md: 3 }
          }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 2 }}>Owner Information</Typography>
            <Typography>Name: <b>{vendor?.owner?.firstName}</b> </Typography>
            {vendor?.owner?.username &&
              <Typography>User Name: <b>@{vendor?.owner?.username}</b> </Typography>
            }
            <Typography>Email: <b>{vendor?.owner?.email}</b> </Typography>
            <Typography>Phone: <b>{vendor?.owner?.phone}</b> </Typography>
            <Typography>Address: <b>{vendor?.owner?.address}</b> </Typography>
          </Stack> */}

        </Stack>

      </Box >



    </Box>
  )
}

export default SupplierDetails