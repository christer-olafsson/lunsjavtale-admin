/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';


const EditUser = ({ closeDialog }) => {
  const [file, setFile] = useState(null)
  const [supplierRole, setSupplierRole] = useState('')

  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Update User Form</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <TextField label='Email' />
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <Stack flex={1} gap={2}>
            <TextField label='First Name' />
            <TextField label='User Name' placeholder='Lunsjavtale.no/' />
            <TextField label='Phone Number' placeholder='+99' />
          </Stack>
          <Stack flex={1} gap={2}>
            <TextField label='LastName' />
            <TextField label='Password' />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                value={supplierRole}
                label="Role"
                onChange={(e) => setSupplierRole(e.target.value)}
              >
                <MenuItem value={'1'}>Manager</MenuItem>
                <MenuItem value={'2'}>Supplier</MenuItem>
                <MenuItem value={'3'}>Warehouse </MenuItem>
                <MenuItem value={'4'}>Products </MenuItem>
                <MenuItem value={'5'}>Inventory </MenuItem>
                <MenuItem value={'6'}>Orders </MenuItem>
                <MenuItem value={'7'}>Products </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction='row' gap={2} mt={2}>
          <FormControlLabel control={<Switch />} label="Status Available" />
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
              <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose files (jpg,png)</Typography>
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                // tabIndex={-1}
                startIcon={<CloudUpload />}
              >
                Upload file
                <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden />
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

export default EditUser