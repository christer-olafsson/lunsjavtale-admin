/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { VENDOR_CREATION } from './graphql/mutation';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';


const AddSupplier = ({ fetchVendors, closeDialog }) => {
  const [errors, setErrors] = useState({})
  const [payload, setPayload] = useState({
    name: '',
    email: '',
    contact: '',
    postCode: '',
    firstName: '',
    password: '',
    commission: null
  })

  const [vendorCreation, { loading }] = useMutation(VENDOR_CREATION, {
    onCompleted: (res) => {
      fetchVendors()
      toast.success(res.vendorCreation.message)
      closeDialog()
    },
    onError: (err) => {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          setErrors(extensions.errors)
        }
      }
    }
  });

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    if (!payload.name) {
      setErrors({ name: 'Supplier Name Required!' })
      return
    }
    if (!payload.firstName) {
      setErrors({ firstName: 'Owner Name Required!' })
      return
    }
    if (!payload.email) {
      setErrors({ email: 'Email Required!' })
      return
    }
    if (!payload.contact) {
      setErrors({ contact: 'Contact Number Required!' })
      return
    }
    if (!payload.postCode) {
      setErrors({ postCode: 'Post code Required!' })
      return
    }
    if (!payload.password) {
      setErrors({ password: 'Password Required!' })
      return
    }
    if (!payload.commission) {
      setErrors({ commission: 'Commission Required!' })
      return
    }
    vendorCreation({
      variables: {
        input: {
          ...payload,
          postCode: parseInt(payload.postCode),
          commission: parseInt(payload.commission)
        }
      }
    })
  }

  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>New Supplier</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <TextField error={Boolean(errors.name)} helperText={errors.name} onChange={handleInputChange} name='name' label='Supplier name' />
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <Stack flex={1} gap={2}>
            <TextField error={Boolean(errors.firstName)} helperText={errors.firstName} onChange={handleInputChange} name='firstName' label='Owner Name' />
            <TextField error={Boolean(errors.contact)} helperText={errors.contact} type='number' onChange={handleInputChange} name='contact' label='Phone Number' />
            <TextField error={Boolean(errors.password)} helperText={errors.password} onChange={handleInputChange} name='password' label='Password' />
          </Stack>
          <Stack flex={1} gap={2}>
            <TextField error={Boolean(errors.email)} helperText={errors.email} onChange={handleInputChange} name='email' label='Email' />
            <TextField onChange={handleInputChange} error={Boolean(errors.postCode)} helperText={errors.postCode} name='postCode' label='Post Code' />
            <TextField
              error={Boolean(errors.commission)}
              helperText={errors.commission}
              type="number"
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                e.target.value = value;
                handleInputChange(e);
              }}
              inputProps={{ min: 0, max: 100, step: 1 }}
              name="commission"
              label="Commission (%)"
            />


            {/* <FormControlLabel control={<Switch />} label="Status Lock" /> */}
          </Stack>
        </Stack>

      </FormGroup>

      <CButton onClick={handleSave} isLoading={loading} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Add</CButton>

    </Box>
  )
}

export default AddSupplier