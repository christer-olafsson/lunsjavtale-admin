/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { Close } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import CButton from '../../common/CButton/CButton';
import toast from 'react-hot-toast';
import { ORDER_STATUS_UPDATE } from './graphql/mutation';
import { ORDER, ORDERS } from './graphql/query';
import { Link } from 'react-router-dom';
import { COMPANY } from '../customers/graphql/query';


const UpdateOrder = ({ data, closeDialog }) => {
  const [errors, setErrors] = useState({});
  const [orderStatus, setOrderStatus] = useState('')
  const [note, setNote] = useState('')

  const [orderStatusUpdate, { loading }] = useMutation(ORDER_STATUS_UPDATE, {
    refetchQueries: [ORDERS, COMPANY],
    onCompleted: (res) => {
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
    if (orderStatus === 'Placed' || orderStatus === 'Updated' || orderStatus === 'Payment-pending' || orderStatus === 'Payment-completed') {
      setErrors({ status: 'Status required!' })
      toast.error('Order Status Required!')
      return
    }
    orderStatusUpdate({
      variables: {
        id: data.id,
        status: orderStatus,
        note
      }
    })
  }

  useEffect(() => {
    setOrderStatus(data.status)
  }, [data])



  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Box>
          <Typography variant='h5' mb={.5}>Order Status</Typography>
          <Link to={`/dashboard/orders/details/${data.id}`} variant='h6'>Order ID: #{data?.id}</Link>
        </Box>
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
          <MenuItem disabled={data?.statuses?.edges.some(status => status.node.status === 'Confirmed')} value={'Confirmed'}>Confirmed</MenuItem>
          <MenuItem disabled={data?.statuses?.edges.some(status => status.node.status === 'Processing')} value={'Processing'}>Processing</MenuItem>
          <MenuItem disabled={data?.statuses?.edges.some(status => status.node.status === 'Ready-to-deliver')} value={'Ready-to-deliver'}>Ready to deliver</MenuItem>
          <MenuItem disabled={data?.statuses?.edges.some(status => status.node.status === 'Delivered')} value={'Delivered'}>Delivered</MenuItem>
          <MenuItem disabled={data?.statuses?.edges.some(status => status.node.status === 'Cancelled')} value={'Cancelled'}>Cancelled</MenuItem>
        </Select>
      </FormControl>
      <TextField onChange={e => setNote(e.target.value)} label='Note' sx={{ mt: 2 }} fullWidth multiline rows={4} />

      <CButton disable={data?.status === 'Delivered' || data?.status === 'Cancelled'} isLoading={loading} onClick={handleUpdate} variant='contained' style={{ width: '100%', mt: 2 }}>
        Update
      </CButton>

    </Box>
  )
}

export default UpdateOrder