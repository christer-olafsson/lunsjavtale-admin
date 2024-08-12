/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { Close, CloudUpload } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { COMPANY_MUTATION } from './graphql/mutation';
import { uploadFile } from '../../utils/uploadFile';
import CButton from '../../common/CButton/CButton';
import toast from 'react-hot-toast';
import { deleteFile } from '../../utils/deleteFile';


const EditCustomer = ({ data, fetchCompany, closeDialog }) => {
  const [file, setFile] = useState('')
  const [logoData, setLogoData] = useState({ logoUrl: '', fileId: '' })
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
    // if (!payload.firstName) {
    //   setErrors({ firstName: 'Owner name required!' })
    //   return
    // }
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
    let attachments = logoData;
    if (file) {
      setFileUploadLoading(true)
      const { secure_url, public_id } = await uploadFile(file, 'companies');
      await deleteFile(logoData.fileId)
      attachments = {
        logoUrl: secure_url,
        fileId: public_id,
      };
      setFileUploadLoading(false)
    }
    companyMutation({
      variables: {
        input: {
          id: data.id,
          ...payload,
          ...attachments,
          postCode: parseInt(payload.postCode),
          noOfEmployees: parseInt(payload.noOfEmployees),
          workingEmail: payload.email
        }
      }
    })
  }

  useEffect(() => {
    setPayload({
      name: data.company,
      firstName: data.firstName,
      email: data.email,
      contact: data.contact,
      noOfEmployees: data.noOfEmployees,
      postCode: data.postCode,
      address: data.address ? data.address : '',
      description: data.description ? data.description : '',
      isBlocked: data.isBlocked ? data.isBlocked : false
    })
    setLogoData({
      logoUrl: data.logoUrl,
      fileId: data.fileId
    })
  }, [data])



  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Update Customer</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <TextField error={Boolean(errors.name)} helperText={errors.name} onChange={handleInputChange} value={payload.name} name='name' label='Customer Name' />
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
        <FormControlLabel
          sx={{ py: 2 }}
          control={<Switch onChange={e => setPayload({ ...payload, isBlocked: e.target.checked })}
            checked={payload.isBlocked} />} label="Lock"
        />

        {/* img from data */}
        <Stack sx={{ position: 'relative' }} direction='row' alignItems='center' gap={2}>
          <Avatar sx={{ width: { xs: '60px', lg: '96px' }, height: { xs: '60px', lg: '96px' } }}
            src={file ? URL.createObjectURL(file) : logoData.logoUrl ? logoData.logoUrl : ''} />
          <IconButton sx={{ width: '25px', height: '25px', position: 'absolute', top: 0, left: 0, bgcolor: 'light.main' }}
            onClick={() => (
              setFile(''),
              setLogoData({})
            )}>
            <Close fontSize='small' />
          </IconButton>
          <Box sx={{
            bgcolor: 'primary.main',
            width: { xs: '200px', md: '100%' },
            padding: '12px 24px',
            borderRadius: '6px',
            color: '#fff'
          }}>
            <input onChange={(e) => {
              const file = e.target.files[0];
              const maxFileSize = 500 * 1024; // 500KB in bytes
              if (file.size > maxFileSize) {
                alert(`File ${file.name} is too large. Please select a file smaller than 500KB.`);
                return
              }
              setFile(e.target.files[0])
            }} type="file" id='staffImg' accept='jpg,png' />
          </Box>
        </Stack>

      </FormGroup>

      <CButton isLoading={loading || fileUploadLoading} onClick={handleSave} variant='contained' style={{ width: '100%', mt: 2 }}>
        Save and Update
      </CButton>

    </Box>
  )
}

export default EditCustomer