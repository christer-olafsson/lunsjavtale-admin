import { Add, BorderColor, Delete, DeleteForeverOutlined, DeleteOutline, EditOutlined, LockOpenOutlined, LockOutlined, MapOutlined, ModeEditOutlineOutlined, MoreHoriz, MoreVert, Place, PlaceOutlined, Remove, RoomOutlined, Search } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import DataTable from '../../common/datatable/DataTable';
import AddArea from './AddArea';
import CDialog from '../../common/dialog/CDialog';
import EditMeeting from './EditMeeting';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { VALID_AREAS } from './graphql/query';
import { format } from 'date-fns';
import EditArea from './EditArea';
import { VALID_AREA_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import useIsMobile from '../../hook/useIsMobile';


const Areas = () => {
  const [addAreaDialogOpen, setAddAreaDialogOpen] = useState(false);
  const [deleteAreaDialogOpen, setDeleteAreaDialogOpen] = useState(false);
  const [editAreaDialogOpen, setEditAreaDialogOpen] = useState(false);
  const [validAreas, setValidAreas] = useState([]);
  const [editAreaData, setEditAreaData] = useState({})
  const [deleteAreaId, setDeleteAreaId] = useState('')

  const isMobile = useIsMobile()


  const [fetchValidAreas, { loading, error }] = useLazyQuery(VALID_AREAS, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setValidAreas(res.validAreas.edges)
    }
  })

  const [validAreaDelete, { loading: deleteLoading }] = useMutation(VALID_AREA_DELETE, {
    onCompleted: (res) => {
      fetchValidAreas()
      toast.success(res.validAreaDelete.message)
      setDeleteAreaDialogOpen(false)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleEditDialog = (row) => {
    setEditAreaDialogOpen(true)
    setEditAreaData(row)
  }

  function handleDeleteDialog(row) {
    setDeleteAreaDialogOpen(true)
    setDeleteAreaId(row.id)
  }

  function handleAreaDelete() {
    validAreaDelete({
      variables: {
        id: deleteAreaId
      }
    })
  }

  const columns = [
    {
      field: 'areaName', width: 200,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Area Name</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <MapOutlined fontSize='small' sx={{ color: row.isActive ? 'inherit' : 'darkgray' }} />
            {
              row.name ?
                <Typography sx={{ fontSize: '14px', color: row.isActive ? 'inherit' : 'darkgray' }}>{row.name}</Typography> :
                <Typography sx={{ fontSize: '12px', color: row.isActive ? 'inherit' : 'darkgray' }}>Empty</Typography>
            }
          </Stack>
        )
      }
    },
    {
      field: 'postCode', headerName: '', width: 120,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Post Code</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
          <RoomOutlined fontSize='small' sx={{
            color: params.row.isActive ? 'inherit' : 'darkgray'
          }} />
          <Typography sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: params.row.isActive ? 'inherit' : 'darkgray'
          }}>{params.row.postCode}</Typography>
        </Stack>
      )
    },
    {
      field: 'CreatedOn', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Created On</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', color: params.row.isActive ? 'inherit' : 'darkgray' }}>{format(params.row.createdOn, 'dd-MM-yyyy')}</Typography>
        </Stack>
      )
    },
    // {
    //   field: 'updatedOn', headerName: '', width: 200,
    //   renderHeader: () => (
    //     <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Updated On</Typography>
    //   ),
    //   renderCell: (params) => (
    //     <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
    //       <Typography sx={{ fontSize: '14px', color: params.row.isActive ? 'inherit' : 'darkgray' }}>{format(params.row.updatedOn, 'dd-MM-yyyy')}</Typography>
    //     </Stack>
    //   )
    // },
    {
      field: 'status', width: 150,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status </Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
              fontSize: { xs: '12px', md: '14px' },
              color: params.row.isActive ? '#fff' : '#fff',
              bgcolor: params.row.isActive ? 'primary.main' : 'darkgray',
              px: 1, borderRadius: '4px',
            }}>{row.isActive ? 'Active' : 'Not Active'}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'edit', headerName: '', width: 60,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleEditDialog(params.row)}>
            <EditOutlined fontSize='small' sx={{ color: params.row.isActive ? 'inherit' : 'darkgray' }} />
          </IconButton>
        )
      },
    },
    {
      field: 'delete', headerName: '',
      width: isMobile ? 60 : undefined,
      flex: isMobile ? undefined : 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteDialog(params.row)}>
            <DeleteOutline fontSize='small' sx={{ color: params.row.isActive ? 'inherit' : 'darkgray' }} />
          </IconButton>
        )
      },
    },
  ];

  const rows = validAreas.map(data => ({
    id: data.node.id,
    name: data.node.name,
    postCode: data.node.postCode,
    createdOn: data.node.createdOn,
    updatedOn: data.node.updatedOn,
    isActive: data.node.isActive
  }))

  useEffect(() => {
    fetchValidAreas()
  }, [])


  return (
    <Box maxWidth='xl'>
      <Stack direction='row' gap={2} alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Areas</Typography>
        <Typography sx={{
          fontSize: '12px',
          fontWeight: 600,
          bgcolor: 'light.main',
          borderRadius: '4px',
          color: 'primary.main',
          px: 1
        }}>{validAreas?.length} Available Areas</Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Box />
        <Button onClick={() => setAddAreaDialogOpen(true)} variant='contained' startIcon={<Add />}>Add Area</Button>
      </Stack>
      {/* edit area */}
      <CDialog openDialog={editAreaDialogOpen}>
        <EditArea data={editAreaData} fetchValidAreas={fetchValidAreas} closeDialog={() => setEditAreaDialogOpen(false)} />
      </CDialog>
      {/* new area */}
      <CDialog openDialog={addAreaDialogOpen}>
        <AddArea fetchValidAreas={fetchValidAreas} closeDialog={() => setAddAreaDialogOpen(false)} />
      </CDialog>
      {/* delete area */}
      <CDialog closeDialog={() => setDeleteAreaDialogOpen(false)} maxWidth='sm' openDialog={deleteAreaDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete this Post Code?</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this Post Code? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <CButton onClick={() => setDeleteAreaDialogOpen(false)} style={{ width: '100%' }} variant='outlined'>Cancel</CButton>
            <CButton isLoading={deleteLoading} onClick={handleAreaDelete} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
          </Stack>
        </Box>
      </CDialog>
      <Box mt={3}>
        {
          loading ? <LoadingBar /> : error ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={rows}
            />
        }
      </Box>
    </Box>
  )
}

export default Areas