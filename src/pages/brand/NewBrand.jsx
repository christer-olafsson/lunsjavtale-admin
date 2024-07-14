/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControlLabel, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { BRAND_MUTATION } from './graphql/mutation';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { uploadFile } from '../../utils/uploadFile';
import CButton from '../../common/CButton/CButton';


const NewBrand = ({ fetchBrands, closeDialog }) => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({})
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [payload, setPayload] = useState({
    name: '',
    siteUrl: '',
    isActive: true
  })

  const [brandMutation, { loading: brandMutationLoading }] = useMutation(BRAND_MUTATION, {
    onCompleted: (res) => {
      toast.success(res.supportedBrandMutation.message)
      closeDialog()
      fetchBrands()
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
      setErrors({ name: 'Brand Name Required!' })
      return
    }
    if (!file) {
      setErrors({ file: 'Brand Logo Required!' })
      return
    }
    let attachments = {};
    if (file) {
      setFileUploadLoading(true)
      const { secure_url, public_id } = await uploadFile(file, 'brands');
      attachments = {
        logoUrl: secure_url,
        fileId: public_id,
      };
      setFileUploadLoading(false)
    }
    brandMutation({
      variables: {
        input: {
          ...payload,
          ...attachments
        }
      }
    })
  }

  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Add Brand</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack flex={1} gap={2}>
        <TextField onChange={handleInputChange} error={Boolean(errors.name)} helperText={errors.name} value={payload.name} name='name' label='Brand Name' />
        <TextField onChange={handleInputChange} value={payload.siteUrl} name='siteUrl' label='Website URL' />
        {/* <FormControlLabel control={<Switch onChange={e => setPayload({ ...payload, isActive: e.target.checked })} checked={payload.isActive} />} label="Status Active " /> */}
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
              <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src={file ? URL.createObjectURL(file) : ''} alt="" />
            </Box>
          </Box>
        }
        <Box sx={{
          flex: 1
        }}>
          <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose files (jpg,png) (Max 500 KB)</Typography>
            <Button
              component='label'
              variant="outlined"
              startIcon={<CloudUpload />}
            >
              Upload file
              <input onChange={(e) => {
                const file = e.target.files[0];
                const maxFileSize = 500 * 1024; // 500KB in bytes
                if (file.size > maxFileSize) {
                  alert(`File ${file.name} is too large. Please select a file smaller than 500KB.`);
                  return
                }
                setFile(e.target.files[0])
              }} type="file" hidden />
            </Button>
            {errors.file && <Typography variant='body2' sx={{ color: 'red' }}>{errors.file}</Typography>}
          </Stack>
        </Box>
      </Stack>

      <CButton onClick={handleSave} isLoading={brandMutationLoading || fileUploadLoading} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Add </CButton>

    </Box>
  )
}

export default NewBrand