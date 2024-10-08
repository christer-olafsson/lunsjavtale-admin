import { AccessTime, Add, ArrowRight, DeleteOutline, DoneOutlineOutlined, EditAttributesOutlined, EditOutlined, LocalPhoneOutlined, Lock, LockOutlined, MailOutlined, Search } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
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
import { nb } from 'date-fns/locale';
import useIsMobile from '../../hook/useIsMobile';

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
  const [searchText, setSearchText] = useState('')
  const [status, setStatus] = useState('');

  const isMobile = useIsMobile()

  const [fetchMeeting, { loading: meetingsLoading, error: meetingsErr }] = useLazyQuery(FOOD_MEETINGS, {
    variables: {
      companyNameEmail: searchText,
      status: status === 'all' ? null : status
    },
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setMeetings(res.foodMeetings.edges.map(item => item.node))
    }
  });

  const [foodMeetingDelete, { loading: deleteLoading }] = useMutation(FOOD_MEETING_DELETE, {
    refetchQueries: [FOOD_MEETINGS],
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
            {
              params.row.company?.isBlocked &&
              <LockOutlined sx={{ color: 'red' }} />
            }
          </Stack>
        )
      }
    },
    {
      field: 'Customer', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Customer</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Avatar src={row.company?.logoUrl ?? ''} />
            {
              row.company !== null ?
                <Stack>
                  <Link to={params.row.company.isDeleted ? '' : `/dashboard/customers/details/${row.company.id}`}>
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: row.company.isDeleted ? 'red' : 'inherit'
                    }}>{row.company.isDeleted && '(removed)'} {row.company.name}
                    </Typography>
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
      field: 'Created On', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Created On</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{format(params.row.createdOn, 'dd-MM-yyyy')}</Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: '14px', mr: .5 }} /> {format(params.row.createdOn, 'hh:mm a')}</Typography>
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
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{format(params.row.meetingTime, 'dd-MM-yyyy')}</Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: '14px', mr: .5 }} /> {format(new Date(params.row.meetingTime), 'hh:mm a')}
          </Typography>
        </Stack>
      )
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
          <Typography sx={{ border: '1px solid lightgray', fontWeight: 600, borderRadius: '4px', px: 1 }}>{params.row.meetingType}</Typography>
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
      field: 'status', width: 150,
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
              px: 1, borderRadius: '4px',
            }}>&#x2022; {row.status}</Typography>
          </Stack>
        )
      }
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
      field: 'delete', headerName: '',
      width: isMobile ? 80 : undefined,
      flex: isMobile ? undefined : 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteDialog(params.row)}>
            <DeleteOutline sx={{ color: 'coral' }} />
          </IconButton>
        )
      },
    },
    // {
    //   field: 'note', headerName: '', flex: 1,
    //   renderHeader: () => (
    //     <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Note</Typography>
    //   ),
    //   renderCell: (params) => (
    //     <Stack sx={{ height: '100%' }} justifyContent='center'>
    //       <Typography variant='body2'>{params.row.note}</Typography>
    //     </Stack>
    //   )
    // },

  ];

  useEffect(() => {
    fetchMeeting()
  }, [])


  return (
    <Box maxWidth='xl'>
      <Stack direction='row' alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Meetings</Typography>
        <Typography sx={{
          fontSize: '12px',
          fontWeight: 600,
          bgcolor: 'light.main',
          borderRadius: '4px',
          color: 'primary.main',
          px: 1
        }}>({meetings?.length})</Typography>
      </Stack>
      <Stack direction={{ xs: 'column-reverse', md: 'row' }} gap={2} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
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
            pl: 2,
          }}>
            <Input onChange={e => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Search' />
            <IconButton><Search /></IconButton>
          </Box>
          <Box sx={{ minWidth: 150 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={e => setStatus(e.target.value)}
              >
                <MenuItem value={'all'}>All</MenuItem>
                <MenuItem value={'pending'}>Pending</MenuItem>
                <MenuItem value={'attended'}>Attended</MenuItem>
                <MenuItem value={'postponed'}>Postponed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
        <Button onClick={() => setCreateMeetingDialogOpen(true)} variant='contained' startIcon={<Add />}>Create Meeting</Button>
      </Stack>
      {/* details meeting */}
      <CDialog maxWidth='md' openDialog={meetingDetailsDialogOpen}>
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
      <Box mt={3}>
        {
          meetingsLoading ? <Loader /> : meetingsErr ? <ErrorMsg /> :
            <DataTable
              getRowHeight={() => 70}
              columns={columns}
              rows={meetings}
              noRowsLabel='No meetings found'
            />
        }
      </Box>
    </Box>
  )
}

export default Meeting