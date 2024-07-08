import { Add, DeleteOutline, EditOutlined, Search } from '@mui/icons-material'
import { Box, Button, IconButton, Input, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { SUPPORTED_BRANDS } from './graphql/query'
import { useLazyQuery, useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { BRAND_DELETE } from './graphql/mutation'
import CDialog from '../../../../common/dialog/CDialog'
import LoadingBar from '../../../../common/loadingBar/LoadingBar'
import ErrorMsg from '../../../../common/ErrorMsg/ErrorMsg'
import CButton from '../../../../common/CButton/CButton'
import EditPost from './EditPost'
import NewPost from './NewPost'
import { InstagramEmbed } from 'react-social-media-embed'
import { FOLLOW_US_DELETE } from '../../graphql/mutation'
import { FOLLOW_US_LIST } from '../../graphql/query'
import Loader from '../../../../common/loader/Index'


const Instagram = () => {
  const [addNewLinkDialogOpen, setAddNewLinkDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('')
  const [links, setLinks] = useState([])

  const [fetchLink, { loading, error}] = useLazyQuery(FOLLOW_US_LIST, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setLinks(res.followUsList.edges.map(item => item.node))
    }
  });
 
  const [deleteLink, { loading: deleteLoading }] = useMutation(FOLLOW_US_DELETE, {
    onCompleted: (res) => {
      toast.success(res.followUsDelete.message)
      setDeleteDialogOpen()
      fetchLink()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  function deleteDialog(data) {
    setDeleteId(data.id);
    setDeleteDialogOpen(true)
  }

  const handleDeleteBrand = () => {
    deleteLink({
      variables: {
        id: deleteId
      }
    })
  }

  useEffect(() => {
    fetchLink()
  }, [])


  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Instagram Post </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Box />
        <Button onClick={() => setAddNewLinkDialogOpen(true)} variant='contained' startIcon={<Add />}>Add Post Link</Button>
        {/* add brand */}
        <CDialog openDialog={addNewLinkDialogOpen}>
          <NewPost fetchLink={fetchLink} closeDialog={() => setAddNewLinkDialogOpen(false)} />
        </CDialog>
      </Stack>
      <Stack direction='row' gap={2} alignItems='center' flexWrap='wrap' mt={{ xs: 10, md: 4 }}>
        {
          loading ? <Loader/> : error ? <ErrorMsg/> :
          links.map((item, id) => (
            <Box sx={{
              borderBottom: '.5px solid lightgray'
            }} key={id}>
              <Button onClick={() => deleteDialog(item)}>Delete</Button>
              <InstagramEmbed url={item.link} width={350} />
              {
                deleteId === item.id &&
                <CDialog closeDialog={() => setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
                  <Box>
                    <img src="/Featured icon.png" alt="" />
                    <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Confim Delete?</Typography>
                    <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this post? This action cannot be undone.</Typography>
                    <Stack direction='row' gap={2} mt={3}>
                      <Button onClick={() => setDeleteDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
                      <CButton isLoading={deleteLoading} onClick={handleDeleteBrand} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
                    </Stack>
                  </Box>
                </CDialog>
              }
            </Box>
          ))
        }
      </Stack >
    </Box >
  )
}

export default Instagram