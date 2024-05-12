/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControlLabel, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';


const EditFaq = ({ closeDialog }) => {
  const [file, setFile] = useState(null);

  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Edit FAQ's</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack flex={1} gap={2}>
        <TextField label='FAQ’s Title' />
        <TextField label='Description' multiline rows={3} />
        <FormControlLabel control={<Switch defaultChecked />} label="Show in Home page " />
      </Stack>
      <Button variant='contained' sx={{ width: '100%', mt: 2 }}>Save and Update </Button>

    </Box>
  )
}

export default EditFaq