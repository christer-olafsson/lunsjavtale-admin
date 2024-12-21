import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { Close, FmdGoodOutlined, StoreOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const PostCodeDetails = ({ data, closeDialog }) => {
  const { postCode, vendorSet } = data || {};

  return (
    <Stack>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Post Code Details
        </Typography>
        <IconButton onClick={closeDialog} size="large">
          <Close />
        </IconButton>
      </Stack>


      <Typography sx={{ textAlign: 'center', fontSize: { xs: '40px', md: '60px' } }}>
        {postCode}
      </Typography>


      <Divider sx={{ mb: 3 }} />

      {/* Vendor Information */}
      <Typography mb={4} variant="h6" fontWeight="bold" gutterBottom>
        Suppliers List
      </Typography>
      {vendorSet?.edges.length > 0 ? (
        vendorSet?.edges?.map(d => (
          <Box key={d?.node?.id}>
            <Stack direction="row" gap={2} alignItems="center" mb={3}>
              <Avatar
                src={d?.node?.logoUrl || '/noImage.png'}
                alt="Vendor Logo"
                sx={{ width: 80, height: 80, borderRadius: 1 }}
              />
              <Box>
                <ListItem disablePadding variant='h5'>
                  <StoreOutlined sx={{ mr: 1, fontSize: '30px' }} />
                  <Link style={{ fontSize: '30px', textDecoration: 'none' }} to={`/dashboard/suppliers/details/${d?.node?.id}`}>
                    {d?.node?.name}
                  </Link>
                </ListItem>
                <Typography mb={1}>
                  <b>Email:</b> {d?.node?.email}
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {d?.node?.postCode?.map((p) => (
                    <Typography
                      key={p}
                      sx={{
                        border: '1px solid lightgray',
                        borderRadius: '4px',
                        bgcolor: postCode === p ? 'lightgray' : '#fff',
                        px: 1.5,
                      }}
                    >
                      {p}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>

        ))
      ) : (
        <Typography color="text.secondary">
          No supplier associated with this post code.
        </Typography>
      )}
    </Stack>
  );
};

export default PostCodeDetails;
