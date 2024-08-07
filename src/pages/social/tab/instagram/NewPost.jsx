/* eslint-disable react/prop-types */
import { Close } from '@mui/icons-material'
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { uploadFile } from '../../../../utils/uploadFile';
import CButton from '../../../../common/CButton/CButton';
import { FOLLOW_US_MUTATION } from '../../graphql/mutation';


const NewPost = ({ fetchLink, closeDialog }) => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({})
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [payload, setPayload] = useState({
    linkType: 'instagram',
    link: '',
  })

  const [followUsMutation, { loading: followUsMutationLoading }] = useMutation(FOLLOW_US_MUTATION, {
    onCompleted: (res) => {
      toast.success(res.followUsMutation.message)
      closeDialog()
      fetchLink()
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
    if (!payload.link) {
      setErrors({ name: 'Post Url Required!' })
      return
    }
    // let attachments = {};
    // if (file) {
    //   setFileUploadLoading(true)
    //   const { secure_url, public_id } = await uploadFile(file, 'brands');
    //   attachments = {
    //     logoUrl: secure_url,
    //     fileId: public_id,
    //   };
    //   setFileUploadLoading(false)
    // }
    followUsMutation({
      variables: {
        input: {
          ...payload
        }
      }
    })
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>New Post</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack flex={1} gap={2}>
        <TextField
          onChange={handleInputChange}
          value={payload.link}
          name='link'
          label='Post URL' 
          placeholder='Ex. https://www.instagram.com/p/C9EqAWjoyHY'
          />
        {/* <FormControlLabel control={<Switch onChange={e => setPayload({ ...payload, isActive: e.target.checked })} checked={payload.isActive} />} label="Status Active " /> */}
      </Stack>

      {/* <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2}>
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
            <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose files (jpg,png)</Typography>
            <Button
              component='label'
              variant="outlined"
              startIcon={<CloudUpload />}
            >
              Upload file
              <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden />
            </Button>
            {errors.file && <Typography variant='body2' sx={{ color: 'red' }}>{errors.file}</Typography>}
          </Stack>
        </Box>
      </Stack> */}

      <CButton onClick={handleSave} isLoading={followUsMutationLoading || fileUploadLoading} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Add </CButton>

    </Box>
  )
}

export default NewPost