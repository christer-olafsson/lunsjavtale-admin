import { useTheme } from '@emotion/react'
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { Box, Button, FormControlLabel, IconButton, Paper, Stack, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CDialog from '../../common/dialog/CDialog'
import NewPromotion from './NewPromotion'
import EditPromotion from './EditPromotion'
import { useLazyQuery } from '@apollo/client'
import { PROMOTIONS } from './graphql/query'
import LoadingBar from '../../common/loadingBar/LoadingBar'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'

const Promotion = () => {
  const [addPromotionDialogOpen, setAddPromotionDialogOpen] = useState(false);
  const [editPromotionDialogOpen, setEditPromotionDialogOpen] = useState(false);
  const [deletePromotionDialogOpen, setDeletePromotionDialogOpen] = useState(false);
  const [selectedPromotionData, setSelectedPromotionData] = useState('');
  const [selectedDeletePromotionId, setSelectedDeletePromotionId] = useState('');
  const [promotions, setPromotions] = useState([])


  const [fetchPromotions, { loading: promotionLoading, error: promotionErr }] = useLazyQuery(PROMOTIONS, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setPromotions(res.promotions.edges)
    }
  })

  function handleEditPromotion(data) {
    setSelectedPromotionData(data)
    setEditPromotionDialogOpen(true)
  }
  function handleDeletePromotion(id) {
    setSelectedDeletePromotionId(id)
    setDeletePromotionDialogOpen(true)
  }
  const theme = useTheme()

  useEffect(() => {
    fetchPromotions()
  }, [])

  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Box />
        <Button onClick={() => setAddPromotionDialogOpen(true)} variant='contained' startIcon={<Add />}>New Promotion</Button>
      </Stack>
      {/*add new */}
      <CDialog openDialog={addPromotionDialogOpen}>
        <NewPromotion fetchPromotions={fetchPromotions} closeDialog={() => setAddPromotionDialogOpen(false)} />
      </CDialog>
      <Stack gap={3} mt={3}>
        {
          promotionLoading ? <LoadingBar /> : promotionErr ? <ErrorMsg /> :
            promotions.map(item => (
              <Paper elevation={3} sx={{ p: 2, maxWidth: '992px', position: 'relative' }} key={item.node.id}>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems='center'>
                  <Box sx={{
                    flex: 1,
                    width: { xs: '100%', md: '300px' },
                    height: '220px'
                  }}>
                    <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src={item.node?.photoUrl ? item.node.photoUrl : ''} alt="" />
                  </Box>
                  <Box sx={{ flex: 2, p: 4 }}>
                    <Stack sx={{
                      position: 'absolute',
                      top: 10, right: 10,
                    }} direction='row'>
                      <IconButton sx={{
                        bgcolor: '#fff',
                        mr: 1,
                        ":hover": {
                          bgcolor: '#fff'
                        }
                      }} onClick={() => handleEditPromotion(item.node)}>
                        <EditOutlined fontSize='small' />
                      </IconButton>
                      <IconButton sx={{
                        bgcolor: '#fff',
                        ":hover": {
                          bgcolor: '#fff'
                        }
                      }} onClick={() => handleDeletePromotion(item.node.id)}>
                        <DeleteOutline fontSize='small' />
                      </IconButton>
                    </Stack>

                    <Typography sx={{ fontSize: '18px', fontWeight: 600, mb: 1 }}>{item.node.title}</Typography>
                    <Typography sx={{
                      fontSize: '12px',
                      bgcolor: item.node.isActive ? 'primary.main': 'darkgray',
                      px: 1, borderRadius: '4px',
                      color: '#fff',
                      width: 'fit-content',mb:1
                    }}>&#x2022; {item.node.isActive ? 'Active' : 'Not Active'}</Typography>
                    <Typography sx={{ fontSize: '14px', mb: 1 }}>{item.node.description}</Typography>
                    <Typography sx={{ fontSize: '14px', mb: 1 }}>{item.node.productUrl}</Typography>
                    <Stack direction='row' gap={3} my={1}>
                      <Typography><b>Start Date:</b> {item.node.startDate}</Typography>
                      <Typography><b>End Date:</b> {item.node.endDate}</Typography>
                    </Stack>
                    <Typography><b>Product Url:</b> {item.node.productUrl}</Typography>
                  </Box>

                  {/*edit */}
                  {
                    selectedPromotionData.id === item.node.id &&
                    <CDialog openDialog={editPromotionDialogOpen}>
                      <EditPromotion fetchPromotions={fetchPromotions} data={selectedPromotionData} closeDialog={() => setEditPromotionDialogOpen(false)} />
                    </CDialog>
                  }
                  {/* delete */}
                  {
                    selectedDeletePromotionId === item.node.id &&
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
              </Paper>
            ))
        }

      </Stack>
    </Box>
  )
}

export default Promotion