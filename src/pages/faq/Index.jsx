import { Add, DeleteOutline, EditOutlined, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NewFaq from './NewFaq'
import CDialog from '../../common/dialog/CDialog'
import EditFaq from './EditFaq'
import { useLazyQuery, useMutation } from '@apollo/client'
import { FAQ_LIST } from './graphql/query'
import LoadingBar from '../../common/loadingBar/LoadingBar'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import toast from 'react-hot-toast'
import { FAQ_DELETE } from './graphql/mutation'
import CButton from '../../common/CButton/CButton'

const Faq = () => {
  const [newFaqDialogOpen, setNewFaqDialogOpen] = useState(false);
  const [editFaqDialogOpen, setEditFaqDialogOpen] = useState(false);
  const [deleteFaqDialogOpen, setDeleteFaqDialogOpen] = useState(false);
  const [selectedfaqId, setSelectedfaqId] = useState('');
  const [selectedDeletefaqId, setSelectedDeletefaqId] = useState('');
  const [editFaqData, setEditFaqData] = useState({})
  const [FAQList, setFAQList] = useState([])

  const [fetchFAQ, { loading, error }] = useLazyQuery(FAQ_LIST, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setFAQList(res.FAQList.edges.map(item => item.node))
    }
  })

  const [FAQDelete, { loading: FaqDeleteLoading }] = useMutation(FAQ_DELETE, {
    onCompleted: (res) => {
      fetchFAQ()
      toast.success(res.FAQDelete.message)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  function handleEditFaq(item) {
    setSelectedfaqId(item.id)
    setEditFaqDialogOpen(true)
    setEditFaqData(item)
  }
  function handleDeleteFaqDialog(id) {
    setSelectedDeletefaqId(id)
    setDeleteFaqDialogOpen(true)
  }

  function handleDeleteFaq() {
    FAQDelete({
      variables: {
        id: selectedDeletefaqId
      }
    })
  }

  useEffect(() => {
    fetchFAQ()
  }, [])


  return (
    <Box maxWidth='xl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Frequently asked questions</Typography>
      <Stack direction='row' justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Box />
        <Button onClick={() => setNewFaqDialogOpen(true)} variant='contained' startIcon={<Add />}>New FAQ</Button>
      </Stack>
      {/* new faq */}
      <CDialog openDialog={newFaqDialogOpen}>
        <NewFaq fetchFAQ={fetchFAQ} closeDialog={() => setNewFaqDialogOpen(false)} />
      </CDialog>
      <Stack mt={3} gap={3}>
        {
          loading ? <LoadingBar /> : error ? <ErrorMsg /> :
            FAQList.map(item => (
              <Paper key={item.id} elevation={3} sx={{ p: 2 }}>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Box mb={1}>
                    <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{item.question}</Typography>
                    {/* <Typography sx={{
                      fontSize: '12px',
                      bgcolor: item.isActive ? 'primary.main' : 'darkgray',
                      px: 1, borderRadius: '4px',
                      color: '#fff',
                      width: 'fit-content',
                    }}>&#x2022; {item.isActive ? 'Active' : 'Not Active'}</Typography> */}
                  </Box>
                  <Stack direction='row'>
                    <IconButton onClick={() => handleEditFaq(item)}>
                      <EditOutlined fontSize='small' />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteFaqDialog(item.id)}>
                      <DeleteOutline fontSize='small' />
                    </IconButton>
                  </Stack>
                </Stack>
                <Typography variant='body2'>{item.answer}</Typography>
                {/* edit faq */}
                {
                  selectedfaqId === item.id &&
                  <CDialog openDialog={editFaqDialogOpen}>
                    <EditFaq fetchFAQ={fetchFAQ} data={editFaqData} closeDialog={() => setEditFaqDialogOpen(false)} />
                  </CDialog>
                }
                {/* delete faq */}
                {
                  selectedDeletefaqId === item.id &&
                  <CDialog closeDialog={() => setDeleteFaqDialogOpen(false)} maxWidth='sm' openDialog={deleteFaqDialogOpen}>
                    <Box>
                      <img src="/Featured icon.png" alt="" />
                      <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete this FAQ?</Typography>
                      <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this FAQ? This action cannot be undone.</Typography>
                      <Stack direction='row' gap={2} mt={3}>
                        <Button onClick={() => setDeleteFaqDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
                        <CButton onClick={handleDeleteFaq} isLoading={FaqDeleteLoading} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
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