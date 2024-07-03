/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@apollo/client';
import { Close } from '@mui/icons-material'
import { Autocomplete, Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import CButton from '../../common/CButton/CButton';
import toast from 'react-hot-toast';
import { APPLY_COUPON, ORDER_STATUS_UPDATE } from './graphql/mutation';
import { COUPONS } from '../coupons/graphql/query';


const ApplyCoupon = ({ data, fetchOrders, closeDialog }) => {
  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState('')
  const [coupons, setCoupons] = useState([]);

  const { loading: couponsLoading } = useQuery(COUPONS, {
    onCompleted: (res) => {
      setCoupons(res.coupons.edges.map(item => item.node))
    }
  })


  const [applyCoupon, { loading }] = useMutation(APPLY_COUPON, {
    onCompleted: (res) => {
      fetchOrders()
      toast.success(res.applyCoupon.message)
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
    if (!couponCode) {
      toast.error('Coupon Code Required!')
      return
    }
    applyCoupon({
      variables: {
        orderId: parseFloat(data.id),
        coupon: couponCode
      }
    })
  }

  // useEffect(() => {
  //   setCouponCode(data.status)
  // }, [data])



  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Apply Coupon</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Autocomplete
        disablePortal
        options={coupons}
        onChange={(_, value) => setCouponCode(value.name)}
        getOptionLabel={(value) => value.name}
        renderInput={(params) => <TextField {...params} label="Coupon Code" />}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              {option.name}
            </li>
          );
        }}
      />

      {/* <TextField
        error={Boolean(errors.couponCode)}
        helperText={errors.couponCode}
        onChange={e => setCouponCode(e.target.value)}
        label='Coupon Code'
        fullWidth
      /> */}

      <CButton isLoading={loading} onClick={handleUpdate} variant='contained' style={{ width: '100%', mt: 2 }}>
        Apply
      </CButton>

    </Box>
  )
}

export default ApplyCoupon