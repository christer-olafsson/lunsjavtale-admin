import { AccessTime, Add, ArrowRight, DeleteOutline, DoneOutlineOutlined, EditAttributesOutlined, EditOutlined, LocalPhoneOutlined, LockOutlined, MailOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import DataTable from '../../common/datatable/DataTable';
import NewMeeting from './NewMeeting';
import CDialog from '../../common/dialog/CDialog';
import MeetingAction from './MeetingAction';
import { useEffect, useState } from 'react';
import { FOOD_MEETINGS } from './graphql/query';
import { useLazyQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { FOOD_MEETING_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import MeetingDetails from './MeetingDetails';
import EditMeeting from './EditMeeting';

const Meeting = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [createMeetingDialogOpen, setCreateMeetingDialogOpen] = useState(false);
  const [deleteMeetingDialogOpen, setDeleteMeetingDialogOpen] = useState(false);
  const [meetingActionDialogOpen, setMeetingActionDialogOpen] = useState(false);
  const [meetingEditData, setMeetingEditData] = useState({})
  const [meetingEditDialogOpen, setMeetingEditDialogOpen] = useState(false)
  const [meetingActionData, setMeetingActionData] = useState({})
  const [foodMeetingDeleteId, setFoodMeetingDeleteId] = useState('')
  const [meetingDetailsDialogOpen, setMeetingDetailsDialogOpen] = useState(false)
  const [meetingDetailsData, setMeetingDetailsData] = useState({})
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


  const handleMeetingAction = (row) => {
    setMeetingActionDialogOpen(true)
    setMeetingActionData(row)
  }

  const handleEdit = (row) => {
    setMeetingEditDialogOpen(true)
    setMeetingEditData(row)
  }

  const handleMeetingDetailsDialog = (row) => {
    setMeetingDetailsDialogOpen(true)
    setMeetingDetailsData(row)
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


  function timeUntilNorway(futureDate) {
    const now = moment();
    const future = moment.tz(futureDate, "UTC").tz("Europe/Oslo");

    const diffInMilliseconds = future.diff(now);
    if (diffInMilliseconds < 0) {
      return 'Date passed!';
    }

    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours`;
    } else {
      return `${diffInDays} days`;
    }
  }

  const formatedNorwayTime = (meetingTime) => {
    const timeZone = 'Europe/Oslo';
    const zonedDate = moment.tz(meetingTime, timeZone);
    const formattedTime = zonedDate.format('HH:mm');
    return formattedTime
  }


  const columns = [
    {
      field: 'details', width: 80, headerName: '',
      renderCell: (params) => {
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <IconButton onClick={() => handleMeetingDetailsDialog(params.row)}>
              <ArrowRight />
            </IconButton>
          </Stack>
        )
      }
    },
    {
      field: 'info', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Company</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Avatar src={row.company?.logoUrl ?? ''} />
            {
              row.company !== null ?
                <Stack>
                  <Link to={`/dashboard/customers/details/${row.company?.id}`}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{row.company?.name}</Typography>
                  </Link>
                  <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{row.company?.email}</Typography>
                  {
                    row.company?.phone &&
                    <Typography sx={{
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <LocalPhoneOutlined sx={{ fontSize: '16px' }} />
                      {row.company?.phone}
                    </Typography>
                  }
                </Stack> :
                <Stack>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{row.companyName}</Typography>
                  <Typography sx={{
                    fontSize: '12px',
                    display: 'inline-flex',
                    fontWeight: 600,
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <MailOutlined sx={{ fontSize: '16px' }} />
                    {row.email}
                  </Typography>
                  <Typography sx={{
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <LocalPhoneOutlined sx={{ fontSize: '16px' }} />
                    {row.phone}
                  </Typography>
                </Stack>
            }
          </Stack>
        )
      }
    },
    {
      field: 'title', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Meeting Title</Typography>
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
      field: 'Created On', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Created On</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{format(params.row.createdOn, 'yyyy-MM-dd')}</Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: '14px' }} /> {formatedNorwayTime(params.row.meetingTime)}</Typography>
          {/* <AccessTime sx={{ fontSize: '14px' }} /> {format(params.row.meetingTime, 'HH:mm')}</Typography> */}
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
            <AccessTime sx={{ fontSize: '14px' }} /> {formatedNorwayTime(params.row.meetingTime)}</Typography>
          {/* <AccessTime sx={{ fontSize: '14px' }} /> {format(params.row.meetingTime, 'HH:mm')}</Typography> */}
        </Stack>
      )
    },
    {
      field: 'startIn', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Start In</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography variant='body2'>{timeUntilNorway(params.row.meetingTime)}</Typography>
        </Stack>
      )
    },
    {
      field: 'status', width: 120,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status </Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
              fontSize: { xs: '12px', md: '16px' },
              color: row.status === 'attended' ? '#fff' : row.status === 'postponed' ? '#fff' : 'black',
              bgcolor: row.status === 'attended' ? 'primary.main' : row.status === 'postponed' ? 'red' : 'yellow',
              px: 1, borderRadius: '8px',
            }}>&#x2022; {row.status}</Typography>
          </Stack>
        )
      }
    },

    {
      field: 'lock', headerName: '', width: 100,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteDialog(params.row)}>
            <Typography sx={{
              fontSize: '14px',
              color: '#fff',
              gap: '5px',
              display: params.row.company?.isBlocked ? 'inline-flex' : 'none',
              bgcolor: 'red',
              px: 1, borderRadius: '4px'
            }}>
              {/* <LockOutlined fontSize='small' /> */}
              Blocked
            </Typography>
          </IconButton>
        )
      },
    },

    {
      field: 'action', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton disabled={params.row.status !== 'pending'} onClick={() => handleMeetingAction(params.row)}>
            <DoneOutlineOutlined sx={{
              color: params.row.status === 'pending' ? 'coral' : 'inherit',
            }} />
          </IconButton>
        )
      },
    },
    {
      field: 'edit', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton
            disabled={params.row.status !== 'pending' || params.row.company === null}
            onClick={() => handleEdit(params.row)}
          >
            <EditOutlined sx={{ color: params.row.status === 'pending' ? 'coral' : 'gray' }} />
          </IconButton>
        )
      },
    },
    {
      field: 'delete', headerName: '', width: 80,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteDialog(params.row)}>
            <DeleteOutline sx={{ color: 'coral' }} />
          </IconButton>
        )
      },
    },
    {
      field: 'note', headerName: '', flex: 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Note</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} justifyContent='center'>
          <Typography variant='body2'>{params.row.note}</Typography>
        </Stack>
      )
    },

  ];

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
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
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
      {/* details meeting */}
      <CDialog openDialog={meetingDetailsDialogOpen}>
        <MeetingDetails data={meetingDetailsData} closeDialog={() => setMeetingDetailsDialogOpen(false)} />
      </CDialog>
      {/* new meeting */}
      <CDialog openDialog={createMeetingDialogOpen}>
        <NewMeeting fetchMeeting={fetchMeeting} closeDialog={() => setCreateMeetingDialogOpen(false)} />
      </CDialog>
      {/* edit meeting */}
      <CDialog openDialog={meetingEditDialogOpen}>
        <EditMeeting data={meetingEditData} fetchMeeting={fetchMeeting} closeDialog={() => setMeetingEditDialogOpen(false)} />
      </CDialog>
      {/* meeting action */}
      <CDialog openDialog={meetingActionDialogOpen}>
        <MeetingAction data={meetingActionData} fetchMeeting={fetchMeeting} closeDialog={() => setMeetingActionDialogOpen(false)} />
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
      <Box mt={{ xs: 10, md: 3 }}>
        {
          meetingsLoading ? <Loader /> : meetingsErr ? <ErrorMsg /> :
            <DataTable
              getRowHeight={() => 70}
              columns={columns}
              rows={meetings}
            />
        }
      </Box>
    </Box>
  )
}

export default Meeting