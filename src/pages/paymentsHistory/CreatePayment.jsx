/* eslint-disable react/prop-types */
import { Close } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'

const CreatePayment = ({ closeDialog }) => {
  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Create Payment</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default CreatePayment