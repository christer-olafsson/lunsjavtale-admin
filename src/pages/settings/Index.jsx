import { BorderColor } from '@mui/icons-material'
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material'
import SettingTab from './SettingTab'

const Setting = () => {

  return (
    <Box maxWidth='lg'>
      <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>System Settings</Typography>
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={4} mt={4}>

        <Box sx={{
          flex: 2
        }}>
          <SettingTab />
        </Box>
      </Stack>
    </Box>
  )
}

export default Setting