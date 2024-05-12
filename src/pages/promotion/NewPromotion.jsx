/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControlLabel, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';


const NewPromotion = ({ closeDialog }) => {
  const [file, setFile] = useState(null);

  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>
      <Stack direction='row' justifyContent='space-between' mb={4} alignItems='center'>
        <Typography variant='h5'>Add Promotional Banner</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack flex={1} gap={2}>
        <TextField label='Promotional Title' />
        <TextField label='Product URL' />
        <TextField label='Description' multiline rows={2} />
        <Stack direction='row' gap={2}>
          <TextField fullWidth helperText='Start Date' type='date' />
          <TextField fullWidth helperText='End Date' type='date' />
        </Stack>
        <FormControlLabel control={<Switch defaultChecked />} label="Show Sign In & Sign Up Page " />
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
            component='label'
              variant="outlined"
              startIcon={<CloudUpload />}
            >
              Upload file
              <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden />
            </Button>
          </Stack>
        </Box>
      </Stack>

      <Button variant='contained' sx={{ width: '100%', mt: 2 }}>Save and Add </Button>

    </Box>
  )
}

export default NewPromotion