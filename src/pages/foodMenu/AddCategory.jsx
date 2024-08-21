/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { CREATE_CATEGORY } from './graphql/mutation';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import { uploadFile } from '../../utils/uploadFile';


const AddCategory = ({ fetchCategory, closeDialog }) => {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [nameErr, setNameErr] = useState('')
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [payload, setPayload] = useState({
    order: 0,
    name: '',
    description: '',
  })


  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    onCompleted: (res) => {
      fetchCategory()
      toast.success(res.categoryMutation.message)
      closeDialog()
    },
    onError: (err) => {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          // setErrors(extensions.errors)
          setErrors(Object.values(extensions.errors));
        }
      }
    }
  });

  const handleSave = async () => {
    if (!payload.name) {
      setNameErr('Category Name Required!');
      return;
    }
    let attachments = {};
    if (file) {
      setFileUploadLoading(true)
      const { secure_url, public_id } = await uploadFile(file, 'category');
      attachments = {
        logoUrl: secure_url,
        fileId: public_id,
      };
      setFileUploadLoading(false)
    }
    createCategory({
      variables: {
        input: {
          ...payload,
          order: parseInt(payload.order),
          ...attachments,
          isActive
        }
      }
    })
  }

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }


  return (
    <Box>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h5'>Add Categories</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <Stack direction='row' gap={2} alignItems='center' py={2}>
          {
            file &&
            <Box sx={{
              width: '50px',
              height: '50px',
            }}>
              <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} src={file ? URL.createObjectURL(file) : ''} alt="" />
            </Box>
          }
          <Stack>
            <label style={{ marginBottom: '10px' }}>Category Image</label>
            <input onChange={(e) => {
              const file = e.target.files[0];
              const maxFileSize = 500 * 1024; // 500KB in bytes
              if (file.size > maxFileSize) {
                alert(`File ${file.name} is too large. Please select a file smaller than 500KB.`);
                return
              }
              setFile(e.target.files[0])
            }} type="file" />
          </Stack>
        </Stack>
        <TextField value={payload.order} onChange={handleInputChange} name='order' type='number' label='Order' sx={{ mb: 2 ,maxWidth:'150px'}} />
        <TextField value={payload.name} error={Boolean(nameErr)} helperText={nameErr} onChange={handleInputChange} name='name' label='Category Name' sx={{ mb: 2 }} />
        <TextField onChange={handleInputChange} name='description' sx={{ mb: 2 }} label='Description' placeholder='Products details' rows={4} multiline />
        <FormControlLabel sx={{ mb: 1, width: 'fit-content' }} control={<Switch checked={isActive} onChange={e => setIsActive(e.target.checked)} />} label="Status Available" />

        {
          errors.length > 0 &&
          <ul style={{ color: 'red', fontSize: '13px' }}>
            {
              errors.map((err, id) => (
                <li key={id}>{err}</li>
              ))
            }
          </ul>
        }

      </FormGroup>

      <Stack direction='row' justifyContent='space-between'>
        <Box />
        <CButton isLoading={loading || fileUploadLoading} onClick={handleSave} variant='contained'>
          Save and Add
        </CButton>
      </Stack>


    </Box>
  )
}

export default AddCategory