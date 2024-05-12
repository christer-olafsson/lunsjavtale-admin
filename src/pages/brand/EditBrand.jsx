/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControlLabel, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';


const EditBrand = ({ closeDialog }) => {
  const [file, setFile] = useState(null);


  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Edit Brand</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack flex={1} gap={2}>
        <TextField label='Brand Title' />
        <TextField label='Website URL' />
        <TextField label='Description' multiline rows={2} />
        <FormControlLabel control={<Switch defaultChecked />} label="Show Brand Carousal " />
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

      <Button variant='contained' sx={{ width: '100%', mt: 2 }}>
        Save and Update
      </Button>

    </Box>
  )
}

export default EditBrand