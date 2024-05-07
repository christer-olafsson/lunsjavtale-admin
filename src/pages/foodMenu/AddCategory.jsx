/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { CREATE_CATEGORY } from './graphql/mutation';
import { useMutation } from '@apollo/client';


const AddCategory = ({ closeDialog }) => {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [nameErr, setNameErr] = useState('')
  const [payload, setPayload] = useState({
    name: '',
    description: '',
  })

  console.log(isActive)

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    onCompleted: (res) => {
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

  const handleSave = () => {
    if(!payload.name){
      setNameErr('Category Name Required!');
      return;
    }
  }

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }


  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>
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
            <Stack direction='row' gap={1}>
              <Box sx={{
                width: '50px',
                height: '50px',
              }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} src={file ? URL.createObjectURL(file) : ''} alt="" />
              </Box>
              <Button onClick={() => setFile(null)}>Remove</Button>
            </Stack>
          }
          <Box>
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              startIcon={<CloudUpload />}
            >
              Category Image
              <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden />
            </Button>
          </Box>
        </Stack>
        <TextField onChange={handleInputChange} name='name' label='Category Name' sx={{ mb: 2 }} />
        <TextField onChange={handleInputChange} name='description' sx={{ mb: 2 }} label='Description' placeholder='Products details' rows={4} multiline />
        <FormControlLabel control={<Switch checked={isActive} onChange={e => setIsActive(e.target.checked)} />} label="Status Available" />

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

      <Button onClick={handleSave} variant='contained' sx={{ width: '100%', mt: 2 }}>
        Save and Add
      </Button>

    </Box>
  )
}

export default AddCategory