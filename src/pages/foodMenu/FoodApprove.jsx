import { Box, Button, DialogActions, ListItem, Typography, IconButton } from '@mui/material';
import React, { useState } from 'react';
import CDialog from '../../common/dialog/CDialog';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { VERIFY_VENDOR_PRODUCT } from './graphql/mutation';
import CButton from '../../common/CButton/CButton';
import { PRODUCTS } from './graphql/query';
import { Close } from '@mui/icons-material';
import { VENDOR } from '../suppliers/graphql/query';

const FoodApprove = ({ closeDialog, data }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState(null);

  const [verifyVendorProduct, { loading }] = useMutation(VERIFY_VENDOR_PRODUCT, {
    onCompleted: (res) => {
      toast.success(res.verifyVendorProduct.message);
      setOpenDialog(false);
      if (closeDialog) {
        closeDialog();
      }
    },
    refetchQueries: [PRODUCTS, VENDOR],
    onError: (err) => {
      console.log(err);
      toast.error('Something went wrong!');
    },
  });

  const handleApprove = () => {
    setStatus('approved');
    verifyVendorProduct({
      variables: {
        id: data?.id,
        status: 'approved',
      },
    });
  };

  const handleReject = () => {
    setStatus('rejected');
    verifyVendorProduct({
      variables: {
        id: data?.id,
        status: 'rejected',
      },
    });
  };

  if (data?.availability) return null;

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Approve
      </Button>
      <CDialog openDialog={openDialog}>
        <ListItem disablePadding sx={{ mb: 3 }}>
          <Typography variant="h5">
            Approve This Product from supplier
            <Link style={{ marginLeft: '10px' }} to={`/dashboard/suppliers/details/${data?.vendor?.id}`}>
              #{data?.vendor?.name}?
            </Link>
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </ListItem>
        <DialogActions>
          <CButton
            isLoading={status === 'rejected' && loading}
            variant="outlined"
            onClick={handleReject}
          >
            Reject
          </CButton>
          <CButton
            isLoading={status === 'approved' && loading}
            variant="contained"
            onClick={handleApprove}
          >
            Approve
          </CButton>
        </DialogActions>
      </CDialog>
    </Box>
  );
};

export default FoodApprove;
