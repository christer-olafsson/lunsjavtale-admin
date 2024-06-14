/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { COMPANY_MUTATION } from './graphql/mutation';
import { uploadFile } from '../../utils/uploadFile';
import CButton from '../../common/CButton/CButton';
import toast from 'react-hot-toast';


const AddCustomer = ({ fetchCompany, closeDialog }) => {
  const [file, setFile] = useState('')
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    name: '',
    firstName: '',
    email: '',
    contact: '',
    noOfEmployees: 0,
    postCode: '',
    address: '',
    description: '',
    isBlocked: false
  })

  const [companyMutation, { loading }] = useMutation(COMPANY_MUTATION, {
    onCompleted: (res) => {
      fetchCompany()
      toast.success(res.companyMutation.message)
      closeDialog()
    },
    onError: (err) => {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          setErrors(extensions.errors)
          // setErrors(Object.values(extensions.errors));
          console.log(extensions.errors)
        }
      }
    }
  });

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!payload.name) {
      setErrors({ name: 'Company name required!' })
      return
    }
    if (!payload.firstName) {
      setErrors({ firstName: 'Owner name required!' })
      return
    }
    if (!payload.email) {
      setErrors({ email: 'Email required!' })
      return
    }
    if (!payload.contact) {
      setErrors({ contact: 'Phone number required!' })
      return
    }
    if (!payload.postCode) {
      setErrors({ postCode: 'Post Code required!' })
      return
    }
    let attachments = {};
    if (file) {
      setFileUploadLoading(true)
      const { secure_url, public_id } = await uploadFile(file, 'company');
      attachments = {
        logoUrl: secure_url,
        fileId: public_id,
      };
      setFileUploadLoading(false)
    }
    companyMutation({
      variables: {
        input: {
          ...payload,
          ...attachments,
          postCode: parseInt(payload.postCode),
          noOfEmployees: parseInt(payload.noOfEmployees),
          workingEmail: payload.email
        }
      }
    })
  }


  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>New Customer</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <TextField error={Boolean(errors.name)} helperText={errors.name} onChange={handleInputChange} value={payload.name} name='name' label='Company Name' />
        <Stack direction='row' gap={2} my={2}>
          <Stack flex={1} gap={2}>
            <TextField error={Boolean(errors.email)} helperText={errors.email} onChange={handleInputChange} value={payload.email} name='email' label='Email' />
            <TextField error={Boolean(errors.noOfEmployees)} helperText={errors.noOfEmployees} onChange={handleInputChange} value={payload.noOfEmployees} name='noOfEmployees' label='No of Employees' />
            <TextField onChange={handleInputChange} value={payload.address} name='address' label='Address' />
          </Stack>
          <Stack flex={1} gap={2}>
            <TextField error={Boolean(errors.firstName)} helperText={errors.firstName} onChange={handleInputChange} value={payload.firstName} name='firstName' label='Owner Name' />
            <TextField error={Boolean(errors.contact)} helperText={errors.contact} onChange={handleInputChange} value={payload.contact} name='contact' type='number' label='Phone Number' />
            <TextField error={Boolean(errors.postCode)} helperText={errors.postCode} onChange={handleInputChange} value={payload.postCode} name='postCode' type='number' label='Post Code' />
          </Stack>
        </Stack>
        <TextField onChange={handleInputChange} value={payload.description} multiline rows={2} name='description' label='Description' />
        <Stack direction='row' gap={2}>
          <FormControlLabel
            control={<Switch onChange={e => setPayload({ ...payload, isBlocked: e.target.checked })}
              checked={payload.isBlocked} />} label="Status Lock" />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2}>
          {
            file && <Box sx={{
              flex: 1
            }}>
              <Box sx={{
                width: '100%',
                height: '114px'
              }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  src={file ? URL.createObjectURL(file) : ''} alt="" />
              </Box>
            </Box>
          }
          <Box sx={{
            flex: 1
          }}>
            <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
              <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose files (jpg,png)</Typography>
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                // tabIndex={-1}
                startIcon={<CloudUpload />}
              >
                Upload file
                <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden />
                {/* <VisuallyHiddenInput type="file" /> */}
              </Button>
            </Stack>
          </Box>
        </Stack>

      </FormGroup>

      <CButton isLoading={loading || fileUploadLoading} onClick={handleSave} variant='contained' style={{ width: '100%', mt: 2 }}>
        Save and Add
      </CButton>

    </Box>
  )
}

export default AddCustomer