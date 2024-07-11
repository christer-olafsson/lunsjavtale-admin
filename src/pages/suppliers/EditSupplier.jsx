/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { VENDOR_CREATION, VENDOR_UPDATE } from './graphql/mutation';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import { uploadFile } from '../../utils/uploadFile';
import { deleteFile } from '../../utils/deleteFile';


const EditSupplier = ({ data, fetchVendors, closeDialog }) => {
  const [errors, setErrors] = useState({})
  const [file, setFile] = useState('')
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [payload, setPayload] = useState({
    name: '',
    firstName: '',
    email: '',
    contact: '',
    postCode: '',
    isBlocked: false
  })

  const [vendorUpdate, { loading }] = useMutation(VENDOR_UPDATE, {
    onCompleted: (res) => {
      fetchVendors()
      toast.success(res.vendorUpdate.message)
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

  const handleSave = async () => {
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
    // if (!payload.password) {
    //   setErrors({ password: 'Password Required!' })
    //   return
    // }
    let attachments = {
      logoUrl: data.logoUrl,
      fileId: data.fileId
    };
    if (file) {
      setFileUploadLoading(true)
      const { secure_url, public_id } = await uploadFile(file, 'vendors');
      await deleteFile(data.fileId)
      attachments = {
        logoUrl: secure_url,
        fileId: public_id,
      };
      setFileUploadLoading(false)
    }
    vendorUpdate({
      variables: {
        input: {
          id: data.id,
          ...payload,
          postCode: parseInt(payload.postCode),
          ...attachments
        }
      }
    })
  }

  useEffect(() => {
    setPayload({
      name: data.name,
      firstName: data.firstName,
      email: data.email,
      contact: data.contact,
      isBlocked: data.isBlocked,
      postCode: data.postCode ? data.postCode : '',
      // firstName: data.users.edges.find(item => item.node.role === 'vendor')?.node.firstName,
    })
  }, [data])
  console.log(data)

  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Edit Supplier</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <TextField sx={{ mb: 2 }} value={payload.name} error={Boolean(errors.name)} helperText={errors.name} onChange={handleInputChange} name='name' label='Supplier name' />
        <TextField value={payload.firstName} error={Boolean(errors.firstName)} helperText={errors.firstName} onChange={handleInputChange} name='firstName' label='Owner Name' />
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <Stack flex={1} gap={2}>
            <TextField value={payload.contact} error={Boolean(errors.contact)} helperText={errors.contact} onChange={handleInputChange} name='contact' label='Phone Number' />
            {/* <TextField error={Boolean(errors.password)} helperText={errors.password} onChange={handleInputChange} name='password' label='Password' /> */}
          </Stack>
          <Stack flex={1} gap={2}>
            <TextField value={payload.postCode} onChange={handleInputChange} name='postCode' label='Post Code' />
          </Stack>
        </Stack>
        <FormControlLabel control={<Switch onChange={e => setPayload({ ...payload, isBlocked: e.target.checked })} checked={payload.isBlocked} />} label="Status Lock" />

      </FormGroup>

      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2}>
        {
          file || data.logoUrl && <Box sx={{
            flex: 1,
            position: 'relative'
          }}>
            <Box sx={{
              width: '100%',
              height: '114px'
            }}>
              <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src={file ? URL.createObjectURL(file) : data.logoUrl ?? ''} alt="" />
              {/* <IconButton onClick={() => setFile('')} sx={{
                position: 'absolute',
                top: -30, left: -20
              }}>
                <Close />
              </IconButton> */}
            </Box>
          </Box>
        }
        <Box sx={{
          flex: 1
        }}>
          <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose files (jpg,png)</Typography>
            <Button
              component='label'
              variant="outlined"
              startIcon={<CloudUpload />}
            >
              Upload file
              <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden />
            </Button>
          </Stack>
        </Box>
      </Stack>

      <CButton onClick={handleSave} isLoading={loading || fileUploadLoading} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Update</CButton>

    </Box>
  )
}

export default EditSupplier