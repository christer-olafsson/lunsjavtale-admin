/* eslint-disable react/prop-types */
import { Close } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import "react-datepicker/dist/react-datepicker.css";



const NewInvoice = ({ closeDialog }) => {

  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>New Invoice </Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      

      <Button variant='contained' sx={{ width: '100%', mt: 2 }}>
        Save and Add
      </Button>

    </Box>
  )
}

export default NewInvoice