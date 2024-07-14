import { Add, DeleteOutline, EditOutlined, Search } from '@mui/icons-material'
import { Box, Button, IconButton, Input, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CDialog from '../../common/dialog/CDialog'
import NewBrand from './NewBrand'
import EditBrand from './EditBrand'
import { SUPPORTED_BRANDS } from './graphql/query'
import { useLazyQuery, useMutation } from '@apollo/client'
import LoadingBar from '../../common/loadingBar/LoadingBar'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import toast from 'react-hot-toast'
import { BRAND_DELETE } from './graphql/mutation'
import { deleteFile } from '../../utils/deleteFile'
import CButton from '../../common/CButton/CButton'

const Brand = () => {
  const [addNewBrandDialogOpen, setAddNewBrandDialogOpen] = useState(false);
  const [editBrandDialogOpen, setEditBrandDialogOpen] = useState(false);
  const [deleteBrandDialogOpen, setDeleteBrandDialogOpen] = useState(false);
  const [editBrandData, setEditBrandData] = useState({});
  const [deleteBrandId, setDeleteBrandId] = useState('')
  const [deleteBrandFileId, setDeleteBrandFileId] = useState('')
  const [deleteFileLoading, setDeleteFileLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [searchText, setSearchText] = useState('')


  const [fetchBrands, { loading: brandsLoading, error: brandsErr }] = useLazyQuery(SUPPORTED_BRANDS, {
    variables: {
      name: searchText
    },
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setBrands(res.supportedBrands.edges)
    }
  });

  const [brandDelete, { loading: brandDeleteLoading }] = useMutation(BRAND_DELETE, {
    onCompleted: (res) => {
      toast.success(res.supportedBrandDelete.message)
      setDeleteBrandDialogOpen()
      fetchBrands()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  function editBrandDialog(data) {
    setEditBrandData(data);
    setEditBrandDialogOpen(true)
  }
  function deleteBrandDialog(data) {
    setDeleteBrandId(data.id);
    setDeleteBrandFileId(data.fileId)
    setDeleteBrandDialogOpen(true)
  }

  const deleteBrand = async () => {
    setDeleteFileLoading(true)
    await deleteFile(deleteBrandFileId)
    setDeleteFileLoading(false)
    brandDelete({
      variables: {
        id: deleteBrandId
      }
    })
  }

  useEffect(() => {
    fetchBrands()
  }, [])


  return (
    <Box maxWidth='xl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Brand </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
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
            <Input onChange={e => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Search.. ' />
          </Box>
        </Stack>
        <Button onClick={() => setAddNewBrandDialogOpen(true)} variant='contained' startIcon={<Add />}>New Brand</Button>
        {/* add brand */}
        <CDialog openDialog={addNewBrandDialogOpen}>
          <NewBrand fetchBrands={fetchBrands} closeDialog={() => setAddNewBrandDialogOpen(false)} />
        </CDialog>
      </Stack>
      <Stack direction='row' gap={2} alignItems='center' flexWrap='wrap' mt={{ xs: 10, md: 4 }}>
        {
          brandsLoading ? <LoadingBar /> : brandsErr ? <ErrorMsg /> : 
          brands.length === 0 ? <Typography>No Brand Found!</Typography> :
            brands.map(item => (
              <Box sx={{
                width: { xs: '100%', md: '250px' },
                height: '150px',
                position: 'relative',
                border: '1px solid lightgray',
                borderRadius: '8px', p: 1
              }} key={item.node.id}>
                <Typography sx={{ fontWeight: 600 }} variant='body2'>{item.node.name}</Typography>
                {/* <Typography sx={{
                  fontSize: '12px',
                  bgcolor: item.node.isActive ? 'primary.main' : 'darkgray',
                  px: 1, borderRadius: '4px',
                  color: '#fff',
                  width: 'fit-content',
                }}>&#x2022; {item.node.isActive ? 'Active' : 'Not Active'}</Typography> */}
                <a href={item.node.siteUrl} target='blank'>{item.node.siteUrl}</a>
                <Box sx={{
                  width: '100%',
                  height: '80px',
                  cursor: 'pointer',
                  mt: .5
                }}>
                  <a href={item.node.siteUrl} target='blank'>
                    <img style={{ width: '100%', height: '100%', objectFit: 'cover', }} src={item.node.logoUrl} alt="" />
                  </a>
                </Box>
                <Stack sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0
                }} direction='row' alignItems='center'>
                  <IconButton onClick={() => editBrandDialog(item.node)}>
                    <EditOutlined fontSize='small' />
                  </IconButton>
                  <IconButton onClick={() => deleteBrandDialog(item.node)}>
                    <DeleteOutline fontSize='small' />
                  </IconButton>
                </Stack>
                {/* edit */}
                {
                  editBrandData.id === item.node.id &&
                  <CDialog openDialog={editBrandDialogOpen}>
                    <EditBrand fetchBrands={fetchBrands} data={editBrandData} closeDialog={() => setEditBrandDialogOpen(false)} />
                  </CDialog>
                }
                {/* delete */}
                {
                  deleteBrandId === item.node.id &&
                  <CDialog closeDialog={() => setDeleteBrandDialogOpen(false)} maxWidth='sm' openDialog={deleteBrandDialogOpen}>
                    <Box>
                      <img src="/Featured icon.png" alt="" />
                      <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete this Brand?</Typography>
                      <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this brand? This action cannot be undone.</Typography>
                      <Stack direction='row' gap={2} mt={3}>
                        <Button onClick={() => setDeleteBrandDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
                        <CButton isLoading={brandDeleteLoading || deleteFileLoading} onClick={deleteBrand} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
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