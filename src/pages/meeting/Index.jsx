import { AccessTime, Add, BorderColor, Delete, DeleteForeverOutlined, DeleteOutline, EditOutlined, LockOpenOutlined, LockOutlined, ModeEditOutlineOutlined, MoreHoriz, MoreVert, Remove, Search } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import DataTable from '../../common/datatable/DataTable';
import NewMeeting from './NewMeeting';
import CDialog from '../../common/dialog/CDialog';
import EditMeeting from './EditMeeting';
import { useEffect, useState } from 'react';
import { FOOD_MEETINGS } from './graphql/query';
import { useLazyQuery, useMutation } from '@apollo/client';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';
import { FOOD_MEETING_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';

const Meeting = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [createMeetingDialogOpen, setCreateMeetingDialogOpen] = useState(false);
  const [deleteMeetingDialogOpen, setDeleteMeetingDialogOpen] = useState(false);
  const [editMeetingDialogOpen, setEditMeetingDialogOpen] = useState(false);
  const [foodMeetingDeleteId, setFoodMeetingDeleteId] = useState('')
  const [meetings, setMeetings] = useState([])

  const [fetchMeeting, { loading: meetingsLoading, error: meetingsErr }] = useLazyQuery(FOOD_MEETINGS, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setMeetings(res.foodMeetings.edges.map(item => item.node))
    }
  });

  const [foodMeetingDelete, { loading: deleteLoading }] = useMutation(FOOD_MEETING_DELETE, {
    onCompleted: (res) => {
      fetchMeeting()
      toast.success(res.foodMeetingDelete.message)
      setDeleteMeetingDialogOpen(false)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });


  console.log(meetings)

  const handleEdit = (row) => {
    setEditMeetingDialogOpen(true)
  }

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };


  function handleDeleteDialog(row) {
    setDeleteMeetingDialogOpen(true)
    setFoodMeetingDeleteId(row.id)
  }

  const handleDelete = () => {
    foodMeetingDelete({
      variables: {
        id: foodMeetingDeleteId
      }
    })
  };


  const getTimeUntilMeeting = (meetingDate) => {
    const now = new Date();
    const targetDate = new Date(meetingDate);
    if (targetDate < now) {
      return 'Time Passed!';
    }
    const days = differenceInDays(targetDate, now);
    const hours = differenceInHours(targetDate, now) % 24;
    const minutes = differenceInMinutes(targetDate, now) % 60;
    const seconds = differenceInSeconds(targetDate, now) % 60;

    if (days > 0) {
      return `Start in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Start in ${hours}hr`;
    } else if (minutes > 0) {
      return `Start in ${minutes}min`;
    } else {
      return `Start in ${seconds}sec`;
    }
  };


  const columns = [
    {
      field: 'info', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Info</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Avatar src='' />
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{params.row.companyName}</Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{params.row.email}</Typography>
            </Box>
          </Stack>
        )
      }
    },
    {
      field: 'title', width: 250,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Title</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography>{row.title}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'type', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Type</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
          <Typography>{params.row.meetingType}</Typography>
        </Stack>
      )
    },
    {
      field: 'meeting-time', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Meeting time</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{format(params.row.meetingTime, 'yyyy-MM-dd')}</Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: '14px' }} /> {format(params.row.meetingTime, 'HH:mm')}</Typography>
        </Stack>
      )
    },
    {
      field: 'startIn', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Start In</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography variant='body2'>{getTimeUntilMeeting(params.row.meetingTime)}</Typography>
        </Stack>
      )
    },
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
              fontSize: { xs: '12px', md: '16px' },
              color: params.row.status === 'upcoming' ? 'primary.main' : 'gray',
              bgcolor: 'light.main',
              px: 1, borderRadius: '8px',
            }}>&#x2022; {'Pending'}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'edit', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditOutlined />
          </IconButton>
        )
      },
    },
    {
      field: 'delete', headerName: '', width: 150,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteDialog(params.row)}>
            <DeleteOutline />
          </IconButton>
        )
      },
    },
  ];

  // useEffect(() => {
  //   setColumnVisibilityModel({
  //     paymentInfo: isMobile ? false : true,
  //     status: isMobile ? false : true,
  //     deliveryDate: isMobile ? false : true,
  //   })
  // }, [isMobile])

  useEffect(() => {
    fetchMeeting()
  }, [])


  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' gap={2} alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Meetings</Typography>
        <Typography sx={{
          fontSize: '12px',
          fontWeight: 600,
          bgcolor: 'light.main',
          borderRadius: '4px',
          color: 'primary.main',
          px: 1
        }}>10 meetings</Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Box sx={{ minWidth: 200 }}>
          <FormControl size='small' fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Filter"
              onChange={handleFilterChange}
            >
              <MenuItem value={5}>All </MenuItem>
              <MenuItem value={10}>Upcoming</MenuItem>
              <MenuItem value={20}>Complete</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button onClick={() => setCreateMeetingDialogOpen(true)} variant='contained' startIcon={<Add />}>Create Meeting</Button>
      </Stack>
      {/* edit meeting */}
      <CDialog openDialog={editMeetingDialogOpen}>
        <EditMeeting closeDialog={() => setEditMeetingDialogOpen(false)} />
      </CDialog>
      {/* new meeting */}
      <CDialog openDialog={createMeetingDialogOpen}>
        <NewMeeting closeDialog={() => setCreateMeetingDialogOpen(false)} />
      </CDialog>
      {/* delete meeting */}
      <CDialog closeDialog={() => setDeleteMeetingDialogOpen(false)} maxWidth='sm' openDialog={deleteMeetingDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete Meeting?</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this Meeting? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <Button onClick={() => setDeleteMeetingDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
            <CButton isLoading={deleteLoading} onClick={handleDelete} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
          </Stack>
        </Box>
      </CDialog>
      <Box mt={3}>
        <DataTable
          columns={columns}
          rows={meetings}
          columnVisibilityModel={columnVisibilityModel}
        />
      </Box>
    </Box>
  )
}

export default Meeting