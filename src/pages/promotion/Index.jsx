import { useTheme } from '@emotion/react'
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { Box, Button, FormControlLabel, IconButton, Stack, Switch, Typography } from '@mui/material'
import React, { useState } from 'react'
import CDialog from '../../common/dialog/CDialog'
import NewPromotion from './NewPromotion'
import EditPromotion from './EditPromotion'

const Promotion = () => {
  const [addPromotionDialogOpen, setAddPromotionDialogOpen] = useState(false);
  const [editPromotionDialogOpen, setEditPromotionDialogOpen] = useState(false);
  const [deletePromotionDialogOpen, setDeletePromotionDialogOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState('');
  const [selectedDeletePromotionId, setSelectedDeletePromotionId] = useState('');

  function handleEditPromotion(id) {
    setSelectedPromotionId(id)
    setEditPromotionDialogOpen(true)
  }
  function handleDeletePromotion(id) {
    setSelectedDeletePromotionId(id)
    setDeletePromotionDialogOpen(true)
  }
  const theme = useTheme()
  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Box />
        <Button onClick={() => setAddPromotionDialogOpen(true)} variant='contained' startIcon={<Add />}>New Promotion</Button>
      </Stack>
      {/*add new */}
      <CDialog openDialog={addPromotionDialogOpen}>
        <NewPromotion closeDialog={() => setAddPromotionDialogOpen(false)} />
      </CDialog>
      <Stack gap={3}>
        {
          [1, 2, 3].map((item, id) => (
            <Stack key={id} sx={{
              maxWidth: '992px',
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: '8px',
              position: 'relative'
            }} direction='row' gap={2} alignItems='center'>
              <Box sx={{
                width: { xs: '100%', md: '500px' },
                height: '220px'
              }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src="/banner1.png" alt="" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 600, mb: 1 }}>Enjoy 20% Off Your Next Meal</Typography>
                <Typography sx={{ fontSize: '16px', mb: 1 }}>Complementing the exquisite cuisine is Lunsjavtale's thoughtfully curated selection of wines and spirits.</Typography>
                <Typography sx={{ fontSize: '14px', mb: 1 }}>https://www.Lunsjavtale.no</Typography>
                <FormControlLabel control={<Switch defaultChecked />} label="Show Sign In & Sign Up Page " />
              </Box>
              <Stack sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                p: 2
              }} direction='row'>
                <IconButton onClick={() => handleEditPromotion(id)}>
                  <EditOutlined fontSize='small' />
                </IconButton>
                <IconButton onClick={() => handleDeletePromotion(id)}>
                  <DeleteOutline fontSize='small' />
                </IconButton>
              </Stack>
              {/*edit */}
              {
                selectedPromotionId === id &&
                <CDialog openDialog={editPromotionDialogOpen}>
                  <EditPromotion closeDialog={() => setEditPromotionDialogOpen(false)} />
                </CDialog>
              }
              {/* delete */}
               {
                selectedDeletePromotionId === id &&
                <CDialog closeDialog={() => setDeletePromotionDialogOpen(false)} maxWidth='sm' openDialog={deletePromotionDialogOpen}>
                  <Box>
                    <img src="/Featured icon.png" alt="" />
                    <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete this Promotion?</Typography>
                    <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this promotion? This action cannot be undone.</Typography>
                    <Stack direction='row' gap={2} mt={3}>
                      <Button onClick={() => setDeletePromotionDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
                      <Button fullWidth variant='contained' color='error'>Delete</Button>
                    </Stack>
                  </Box>
                </CDialog>
              }
            </Stack>
          ))
        }

      </Stack>
    </Box>
  )
}

export default Promotion