/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';


const AddCustomer = ({ closeDialog }) => {
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('');
  const [productImg, setProductImg] = useState(null)


  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>New Customer</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <Stack flex={1} gap={2}>
            <TextField label='Company Name' />
            <TextField label='Address' />
            <TextField label='Phone Number' />
            <TextField type='number' label='Password' />
          </Stack>
          <Stack flex={1} gap={2}>
            <TextField label='Email' />
            <TextField type='number' label='Post Code' />
            <TextField label='User ID' />
          </Stack>
        </Stack>
        <Stack direction='row' gap={2} mt={2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Status Available" />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2}>
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

export default AddCustomer