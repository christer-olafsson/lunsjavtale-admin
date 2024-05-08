/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { CATEGORY_DELETE, CREATE_CATEGORY } from './graphql/mutation';
import { useMutation } from '@apollo/client';
import { fileUpload } from '../../utils/fileHandle/fileUpload';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import { GET_ALL_CATEGORY } from './graphql/query';


const EditCategory = ({ fetchCategory, data, closeDialog }) => {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(null);
  const [nameErr, setNameErr] = useState('')
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [deleteBtnOn, setDeleteBtnOn] = useState(false)
  const [payload, setPayload] = useState({
    name: '',
    description: '',
  })


  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    onCompleted: (res) => {
      fetchCategory()
      toast.success(res.categoryMutation.message)
      closeDialog();
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
  const [deleteCategory, { loading: deleteCatLoading }] = useMutation(CATEGORY_DELETE, {
    onCompleted: (res) => {
      toast.success(res.categoryDelete.message)
      fetchCategory()
      closeDialog();
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleUpdate = async () => {
    if (!payload.name) {
      setNameErr('Category Name Required!');
      return;
    }
    let photoUrl = data.node.logoUrl;
    if (file) {
      setFileUploadLoading(true)
      const { location } = await fileUpload(file, 'category');
      setFileUploadLoading(false)
      photoUrl = location
    }
    createCategory({
      variables: {
        input: {
          ...payload,
          id: data.node.id,
          isActive,
          logoUrl: photoUrl
        }
      }
    })
  }

  const handleDelete = () => {
    deleteCategory({
      variables: {
        id: data.node.id
      }
    })
  }

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  };

  useEffect(() => {
    setPayload({
      name: data.node.name,
      description: data.node.description
    })
    setIsActive(data.node.isActive)
  }, [data])



  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h5'>Edit Categories</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <Stack direction='row' gap={2} alignItems='center' py={2}>
          {
            (file || data.node.logoUrl) &&
            <Box sx={{
              width: '50px',
              height: '50px',
            }}>
              <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                src={file ? URL.createObjectURL(file) : data.node.logoUrl ? data.node.logoUrl : ''} alt="" />
            </Box>
          }
          <Stack>
            <label style={{ marginBottom: '10px' }}>Category Image</label>
            <input onChange={(e) => setFile(e.target.files[0])} type="file" />
          </Stack>
        </Stack>
        <TextField value={payload.name} error={Boolean(nameErr)} helperText={nameErr} onChange={handleInputChange} name='name' label='Category Name' sx={{ mb: 2 }} />
        <TextField value={payload.description} onChange={handleInputChange} name='description' sx={{ mb: 2 }} label='Description' placeholder='Products details' rows={4} multiline />
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
        {
          deleteBtnOn ?
            <Paper elevation={4} sx={{
              py: 1, px: 2
            }}>
              <Typography sx={{ fontSize: '14px' }}>Confirm delete this category?</Typography>
              <Stack direction='row' gap={2} alignItems='center' justifyContent='end'>
                <Button color="error" disabled={deleteCatLoading} onClick={handleDelete} size='small' >Confirm</Button>
                <Button onClick={() => setDeleteBtnOn(false)} size='small'>Cencel</Button>
              </Stack>
            </Paper> :
            <Button onClick={() => setDeleteBtnOn(true)} color="error">Delete this Category</Button>
        }
        <CButton isLoading={loading || fileUploadLoading} onClick={handleUpdate} variant='contained' sx={{ width: '100%', mt: 2 }}>
          Update
        </CButton>
      </Stack>

    </Box>
  )
}

export default EditCategory