import { Add, DeleteOutline, EditOutlined, Search } from '@mui/icons-material'
import { Box, Button, IconButton, Input, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import CDialog from '../../common/dialog/CDialog'
import NewBrand from './NewBrand'
import EditBrand from './EditBrand'

const Brand = () => {
  const [addNewBrandDialogOpen, setAddNewBrandDialogOpen] = useState(false);
  const [editBrandDialogOpen, setEditBrandDialogOpen] = useState(false);
  const [deleteBrandDialogOpen, setDeleteBrandDialogOpen] = useState(false);
  const [brandId, setBrandId] = useState('');
  const [deleteBrandId, setDeleteBrandId] = useState('')

  function editBrandDialog(id) {
    setBrandId(id);
    setEditBrandDialogOpen(true)
  }
  function deleteBrandDialog(id) {
    setDeleteBrandId(id);
    setDeleteBrandDialogOpen(true)
  }

  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Brand </Typography>
      <Stack direction='row' justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Stack direction='row' gap={2}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '480px',
            bgcolor: '#fff',
            width: '100%',
            border: '1px solid lightgray',
            borderRadius: '4px',
          }}>
            <IconButton><Search /></IconButton>
            <Input fullWidth disableUnderline placeholder='Search.. ' />
          </Box>
        </Stack>
        <Button onClick={() => setAddNewBrandDialogOpen(true)} variant='contained' startIcon={<Add />}>New Brand</Button>
        {/* add brand */}
        <CDialog openDialog={addNewBrandDialogOpen}>
          <NewBrand closeDialog={() => setAddNewBrandDialogOpen(false)} />
        </CDialog>
      </Stack>
      <Stack direction='row' gap={2} alignItems='center' flexWrap='wrap' mt={4}>
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, id) => (
            <Box sx={{
              width: '229px',
              height: '96px',
              position: 'relative'
            }} key={id}>
              <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="/brandlogo.png" alt="" />
              <Stack sx={{
                position: 'absolute',
                top: 0,
                right: 0
              }} direction='row' alignItems='center'>
                <IconButton onClick={() => editBrandDialog(id)}>
                  <EditOutlined fontSize='small' />
                </IconButton>
                <IconButton onClick={() => deleteBrandDialog(id)}>
                  <DeleteOutline fontSize='small' />
                </IconButton>
              </Stack>
              {/* edit */}
              {
                brandId === id &&
                <CDialog openDialog={editBrandDialogOpen}>
                  <EditBrand closeDialog={() => setEditBrandDialogOpen(false)} />
                </CDialog>
              }
              {/* delete */}
              {
                deleteBrandId === id &&
                <CDialog closeDialog={() => setDeleteBrandDialogOpen(false)} maxWidth='sm' openDialog={deleteBrandDialogOpen}>
                  <Box>
                    <img src="/Featured icon.png" alt="" />
                    <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete this Brand?</Typography>
                    <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this brand? This action cannot be undone.</Typography>
                    <Stack direction='row' gap={2} mt={3}>
                      <Button onClick={() => setDeleteBrandDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
                      <Button fullWidth variant='contained' color='error'>Delete</Button>
                    </Stack>
                  </Box>
                </CDialog>
              }
            </Box>
          ))
        }
      </Stack>
    </Box>
  )
}

export default Brand