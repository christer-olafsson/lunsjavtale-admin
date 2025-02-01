import { useLazyQuery, useQuery } from '@apollo/client';
import { FmdGoodOutlined, LockOutlined, West } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import { VENDOR } from './graphql/query';
import { format } from 'date-fns';
import SupplierProductCard from './SupplierProductCard';
import LoadingBar from '../../common/loadingBar/LoadingBar';

const SupplierDetails = () => {
  const [vendor, setVendor] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading: vendorLoading, error: vendorErr } = useQuery(VENDOR, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: { id },
    onCompleted: (res) => setVendor(res.vendor),
  });


  if (vendorLoading) {
    return <LoadingBar />
  }
  if (vendorErr) {
    return <ErrorMsg />
  }

  return (
    <Box maxWidth="xl" sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <West />
        </IconButton>
      </Stack>

      {/* Vendor Information */}
      <Box mt={3}>
        <Stack direction={{ xs: 'column', lg: 'row' }} gap={6}>
          {/* Vendor Details Section */}
          <Box flex={2}>
            <Stack gap={3}>
              <Box>
                <Stack
                  gap={2}
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                >
                  {/* Vendor Basic Info */}
                  <Stack direction="row" gap={3} alignItems="center">
                    <img
                      src={vendor?.logoUrl || '/noImage.png'}
                      alt="Vendor Logo"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <Box>
                      <Typography variant='h5' mb={2}>
                        <span style={{ fontWeight: 600 }}>
                          Supplier:{' '}
                        </span>

                        {vendor?.name}{' '}
                        {vendor.isBlocked && (
                          <LockOutlined sx={{ color: 'red', ml: 1 }} />
                        )}

                      </Typography>
                      <Typography><b>Email: </b>{vendor?.email}</Typography>
                      {vendor?.isDeleted && <Chip label="Deleted" color="warning" />}

                      {vendor.createdOn && (
                        <Typography>
                          <b>Joined:</b> {format(vendor?.createdOn, 'dd-MM-yyyy')}
                        </Typography>
                      )}
                      <Typography><b>Contact: </b>{vendor?.contact}</Typography>
                      <Typography mt={2} mb={1}><b>Post Codes:</b></Typography>
                      <Stack direction="row" gap={1.5} flexWrap="wrap">
                        {vendor?.postCode?.map((p) => (
                          <Typography
                            key={p}
                            sx={{
                              border: '1px solid lightgray',
                              borderRadius: '4px',
                              px: 1.5,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: .5,
                              py: .5
                            }}
                          >
                            <FmdGoodOutlined fontSize='small' />
                            {p}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>

                  {/* Financial Info */}
                  <Stack gap={2} mt={{ xs: 3, md: 0 }}>
                    {[
                      { label: 'Sold Amount', value: `${vendor?.soldAmount ?? '00'} kr`, bgColor: 'RebeccaPurple' },
                      { label: 'Lunsjavtale Commission', value: `${vendor?.commission ?? '0'} %`, bgColor: 'blue' },
                      { label: 'Lunsjavtale Commission', value: `${vendor?.ownerCommission ?? '0'} kr`, bgColor: 'blue' },
                      { label: 'Withdrawn Amount', value: `${vendor?.withdrawnAmount ?? '00'} kr`, bgColor: 'purple' },
                      { label: 'Balance', value: `${vendor?.balance ?? '00'} kr`, bgColor: 'green' },
                    ].map((item, index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontSize: '14px',
                          bgcolor: item.bgColor,
                          color: '#fff',
                          borderRadius: '4px',
                          textAlign: 'center',
                          px: 2,
                          py: 1,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <i>{item.label}: </i> <b>{item.value}</b>
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            {/* Products Section */}
            <Typography my={3} variant="h5">
              All Products
            </Typography>
            <Divider />
            <Stack direction="row" flexWrap="wrap" gap={2} mt={3}>
              {vendorLoading ? (
                <Loader />
              ) : vendorErr ? (
                <ErrorMsg />
              ) : vendor?.products?.edges.filter((item) => !item.node.isDeleted).length === 0 ? (
                <Typography>No products found</Typography>
              ) : (
                vendor?.products?.edges
                  .filter((item) => !item.node.isDeleted)
                  .map((item) => <SupplierProductCard key={item.node.id} data={item.node} />)
              )}
            </Stack>
          </Box>

          {/* Owner Info Section */}
          <Box flex={1}>
            <Typography variant="h5" sx={{ mb: 2, }}>
              Owner Information
            </Typography>
            <Avatar
              sx={{ mb: 1, width: '100px', height: '100px' }}
              src={vendor?.owner?.photoUrl}
              alt="Owner"
            />
            <Typography>Name: <b>{vendor?.owner?.firstName}</b></Typography>
            <Typography>Email: <b>{vendor?.owner?.email}</b></Typography>
            <Typography>Phone: <b>{vendor?.owner?.phone}</b></Typography>
            <Typography>Gender: <b>{vendor?.owner?.gender}</b></Typography>
            <Typography>Birth Date: <b>{vendor?.owner?.dateOfBirth}</b></Typography>
            <Typography>Address: <b>{vendor?.owner?.address}</b></Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default SupplierDetails;
