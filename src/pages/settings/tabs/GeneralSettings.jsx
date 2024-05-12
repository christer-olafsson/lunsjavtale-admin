import { CloudUpload } from '@mui/icons-material'
import { Box, Button, Input, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const GeneralSettings = () => {
  const [file, setFile] = useState('')
  return (
    <Box>

      <Stack direction='row' gap={6} alignItems='center'>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Public Profile</Typography>
          <Typography sx={{ fontSize: '14px' }}>This will be displayed on your profile.</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Input fullWidth disableUnderline sx={{ border: '1px solid #C4C4C4', p: 1, borderRadius: '4px' }} name='username' startAdornment={
            <InputAdornment position="start">
              <Typography>Lunsjavtale.no/profile</Typography>
            </InputAdornment>
          }
          />
        </Box>
      </Stack>

      <Stack direction='row' gap={6} mt={4} alignItems='center'>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Tagline</Typography>
          <Typography sx={{ fontSize: '14px' }}>A quick snapshot of your company</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <TextField fullWidth multiline value={'Crafting Culinary Experiences Where Every Meal Tells a Story: Discover the Art of Dining with Lunsjavtale Restaurants'} />
        </Box>
      </Stack>

      <Stack direction='row' gap={6} mt={4} alignItems='center'>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Company logo</Typography>
          <Typography sx={{ fontSize: '14px' }}>Update your company logo and then choose where you want it to display.</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
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
        </Box>
      </Stack>

      <Stack direction='row' gap={6} mt={4} alignItems='center'>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Address</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <TextField fullWidth value='Sunset Boulevard 56'  />
        </Box>
      </Stack>

    </Box>
  )
}

export default GeneralSettings