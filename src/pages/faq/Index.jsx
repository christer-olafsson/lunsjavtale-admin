import { Add, DeleteOutline, EditOutlined, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import NewFaq from './NewFaq'
import CDialog from '../../common/dialog/CDialog'
import EditFaq from './EditFaq'

const Faq = () => {
  const [newFaqDialogOpen, setNewFaqDialogOpen] = useState(false);
  const [editFaqDialogOpen, setEditFaqDialogOpen] = useState(false);
  const [deleteFaqDialogOpen, setDeleteFaqDialogOpen] = useState(false);
  const [selectedfaqId, setSelectedfaqId] = useState('');
  const [selectedDeletefaqId, setSelectedDeletefaqId] = useState('');

  function handleEditFaq(id) {
    setSelectedfaqId(id)
    setEditFaqDialogOpen(true)
  }
  function handleDeleteFaq(id) {
    setSelectedDeletefaqId(id)
    setDeleteFaqDialogOpen(true)
  }

  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Frequently asked questions</Typography>
      <Stack direction='row' justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Box />
        <Button onClick={() => setNewFaqDialogOpen(true)} variant='contained' startIcon={<Add />}>New FAQ</Button>
      </Stack>
      {/* new faq */}
      <CDialog openDialog={newFaqDialogOpen}>
        <NewFaq closeDialog={() => setNewFaqDialogOpen(false)} />
      </CDialog>
      <Stack mt={3} gap={3}>
        {
          [1, 2, 3, 4, 5].map((item, id) => (
            <Paper key={id} elevation={3} sx={{ p: 2 }}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Typography sx={{ fontSize: '18px', fontWeight: 600, mb: 2 }}>Company agreement - Administrator</Typography>
                <Stack direction='row'>
                  <IconButton onClick={() => handleEditFaq(id)}>
                    <EditOutlined fontSize='small' />
                  </IconButton>
                  <IconButton onClick={()=> handleDeleteFaq(id)}>
                    <DeleteOutline fontSize='small' />
                  </IconButton>
                </Stack>
              </Stack>
              <Typography variant='body2'>Are you a company administrator and want to manage your company's profile? Log in to your profile - select company agreement in the blue circle in the right corner. / Add employees: Company agreement > settings > employees in the agreement. Paste the email address of the employee in the field at the bottom > add. / Change orders for one or more of the employees: Company agreement > settings > employees in the agreement > select the one or those who will not have lunch > select your action and date from - to > confirm. Here you can also cancel subscriptions for employees who have quit or will be away for a longer period.
              </Typography>
              {/* new faq */}
              {
                selectedfaqId === id &&
                <CDialog openDialog={editFaqDialogOpen}>
                  <EditFaq closeDialog={() => setEditFaqDialogOpen(false)} />
                </CDialog>
              }
               {
                selectedDeletefaqId === id &&
                <CDialog closeDialog={() => setDeleteFaqDialogOpen(false)} maxWidth='sm' openDialog={deleteFaqDialogOpen}>
                  <Box>
                    <img src="/Featured icon.png" alt="" />
                    <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete this FAQ?</Typography>
                    <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this FAQ? This action cannot be undone.</Typography>
                    <Stack direction='row' gap={2} mt={3}>
                      <Button onClick={() => setDeleteFaqDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
                      <Button fullWidth variant='contained' color='error'>Delete</Button>
                    </Stack>
                  </Box>
                </CDialog>
              }
            </Paper>
          ))
        }
      </Stack>
    </Box>
  )
}

export default Faq