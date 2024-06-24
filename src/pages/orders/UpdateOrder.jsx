/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { Close } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import CButton from '../../common/CButton/CButton';
import toast from 'react-hot-toast';
import { ORDER_STATUS_UPDATE } from './graphql/mutation';


const UpdateOrder = ({ data, fetchOrders, closeDialog }) => {
  const [errors, setErrors] = useState({});
  const [orderStatus, setOrderStatus] = useState('')

  const [orderStatusUpdate, { loading }] = useMutation(ORDER_STATUS_UPDATE, {
    onCompleted: (res) => {
      fetchOrders()
      toast.success(res.orderStatusUpdate.message)
      closeDialog()
    },
    onError: (err) => {
      toast.error(err.message)
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          setErrors(extensions.errors)
        }
      }
    }
  });


  const handleUpdate = () => {
    if (!orderStatus) {
      setErrors({ status: 'Status required!' })
      toast.error('Order Status Required!')
      return
    }
    orderStatusUpdate({
      variables: {
        id: data.id,
        status: orderStatus
      }
    })
  }

  useEffect(() => {
    setOrderStatus(data.status)
  }, [data])



  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Order Status</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormControl fullWidth>
        <InputLabel>Order Status</InputLabel>
        <Select
          label="Order Status"
          error={Boolean(errors.status)}
          value={orderStatus}
          onChange={e => setOrderStatus(e.target.value)}
        >
          <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
          <MenuItem value={'Confirmed'}>Confirmed </MenuItem>
          <MenuItem value={'Delivered'}>Delivered </MenuItem>
        </Select>
      </FormControl>

      <CButton isLoading={loading} onClick={handleUpdate} variant='contained' style={{ width: '100%', mt: 2 }}>
        Save and Update
      </CButton>

    </Box>
  )
}

export default UpdateOrder