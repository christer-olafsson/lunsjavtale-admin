/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControlLabel, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { PROMOTION_MUTATION } from './graphql/mutation';
import toast from 'react-hot-toast';
import { uploadFile } from '../../utils/uploadFile';
import CButton from '../../common/CButton/CButton';
import { deleteFile } from '../../utils/deleteFile';


const EditPromotion = ({ data, fetchPromotions, closeDialog }) => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({})
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [payload, setPayload] = useState({
    title: '',
    description: '',
    productUrl: 'https://',
    startDate: '',
    endDate: '',
    isActive: true
  })

  const [promotionMutation, { loading }] = useMutation(PROMOTION_MUTATION, {
    onCompleted: (res) => {
      fetchPromotions()
      toast.success(res.promotionMutation.message)
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
  };

  const handleSave = async () => {
    if (!payload.title) {
      setErrors({ title: 'Title empty!' })
      return
    }
    if (!payload.description) {
      setErrors({ description: 'Description empty!' })
      return
    }
    let attachments = {
      photoUrl: data.photoUrl,
      fileId: data.fileId
    };
    if (file) {
      setFileUploadLoading(true)
      const { secure_url, public_id } = await uploadFile(file, 'promotions');
      await deleteFile(data.fileId)
      attachments = {
        photoUrl: secure_url,
        fileId: public_id,
      };
      setFileUploadLoading(false)
    }
    promotionMutation({
      variables: {
        input: {
          id: data.id,
          ...payload,
          ...attachments,
          startDate: payload.startDate ? payload.startDate : null,
          endDate: payload.endDate ? payload.endDate : null
        }
      }
    })
  }

  useEffect(() => {
    setPayload({
      title: data.title,
      description: data.description,
      productUrl: data.productUrl ? data.productUrl : 'https://',
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive ? data.isActive : false
    })
  }, [data])


  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' mb={4} alignItems='center'>
        <Typography variant='h5'>Edit Promotional Banner</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack flex={1} gap={2}>
        <TextField error={Boolean(errors.title)} helperText={errors.title} name='title' onChange={handleInputChange} value={payload.title} label='Promotional Title' />
        <TextField name='productUrl' onChange={handleInputChange} value={payload.productUrl} label='Product URL' />
        <TextField error={Boolean(errors.description)} helperText={errors.description} name='description' onChange={handleInputChange} value={payload.description} label='Description' multiline rows={4} />
        <Stack direction='row' gap={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant='body2'>Start Date</Typography>
            <TextField name='startDate' onChange={handleInputChange} value={payload.startDate} size='small' fullWidth type='date' />
            <Button onClick={() => (
              setPayload({ ...payload, startDate: '', endDate: '' })
            )}>Clear Date</Button>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant='body2'>End Date</Typography>
            <TextField name='endDate' onChange={handleInputChange} value={payload.endDate} size='small' fullWidth type='date' />
          </Box>
        </Stack>
        <FormControlLabel control={<Switch onChange={(e) => setPayload({ ...payload, isActive: e.target.checked })} checked={payload.isActive} />} label="Active" />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2}>
        <Box sx={{
          flex: 1
        }}>
          <Box sx={{
            width: '100%',
            height: '114px'
          }}>
            <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src={file ? URL.createObjectURL(file) : data.photoUrl ? data.photoUrl : ''} alt="" />
          </Box>
        </Box>
        <Box sx={{
          flex: 1
        }}>
          <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose files (jpg,png) (Max 500KB)</Typography>
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
          </Stack>
        </Box>
      </Stack>

      <CButton onClick={handleSave} isLoading={fileUploadLoading || loading} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Update </CButton>
    </Box>
  )
}

export default EditPromotion