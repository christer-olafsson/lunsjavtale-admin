/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';


const AddCategory = ({ closeDialog }) => {
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('');
  const [productImg, setProductImg] = useState(null)


  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Add Categories</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <TextField label='Category Name' sx={{ mb: 2 }} />
        <TextField sx={{mb:2}} label='Description' placeholder='Products details' rows={4} multiline />
        <FormControlLabel control={<Switch defaultChecked />} label="Status Available" />
        <Typography mt={2}>Category Image</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={1}>
          {
            productImg && <Box sx={{
              flex: 1
            }}>
              <Box sx={{
                width: '100%',
                height: '114px'
              }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src={productImg ? URL.createObjectURL(productImg) : ''} alt="" />
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
                <input onChange={(e) => setProductImg(e.target.files[0])} type="file" hidden />
                {/* <VisuallyHiddenInput type="file" /> */}
              </Button>
            </Stack>
          </Box>
        </Stack>

      </FormGroup>

      <Button variant='contained' sx={{ width: '100%', mt: 2 }}>
        Save and Add
      </Button>

    </Box>
  )
}

export default AddCategory