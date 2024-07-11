import { Box, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ADMIN_NOTIFICATIONS } from './graphql/query';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { AccessTime } from '@mui/icons-material';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import DataTable from '../../common/datatable/DataTable';
import CButton from '../../common/CButton/CButton';
import { NOTIFICATION_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [fetchAdminNotifications, { loading, error }] = useLazyQuery(ADMIN_NOTIFICATIONS, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setNotifications(res.adminNotifications.edges.map(item => item.node))
    }
  });

  const [notificationDelete, { loading: deleteLoading }] = useMutation(NOTIFICATION_DELETE, {
    onCompleted: (res) => {
      toast.success(res.notificationDelete.message)
      fetchAdminNotifications()
      setSelectedRowIds([])
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleNotificationDelete = () => {
    notificationDelete({
      variables: {
        ids: selectedRowIds,
      }
    })
  }

  const getTimeDifference = (isoString) => {
    const date = parseISO(isoString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

 console.log(notifications)
  const columns = [
    {
      field: 'Time', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Time</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={.5} alignItems='center'>
            <AccessTime sx={{ fontSize: '16px', color: row.isSeen ? 'gray' : 'green' }} />
            <Typography sx={{
              color: row.isSeen ? 'gray' : 'green'
            }} variant='body2'>{getTimeDifference(row.sentOn)}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'title', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Title</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
              color: row.isSeen ? 'gray' : 'green'
            }}>{row.title}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'Message', flex: 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Message</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Link to={`/dashboard/orders/details/${row.objectId}`}>
              <Typography sx={{
                color: row.isSeen ? 'gray' : 'green'
              }} >{row.message}</Typography>
            </Link>
          </Stack>
        )
      }
    },
  ]

  useEffect(() => {
    fetchAdminNotifications()
  }, [])


  return (
    <Box maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>All Notifications</Typography>
      {
        <CButton
          style={{
            mt: 1,
            visibility: selectedRowIds.length > 0 ? 'visible' : 'hidden'
          }}
          isLoading={deleteLoading}
          onClick={handleNotificationDelete}
          variant='contained'>
          Delete
        </CButton>
      }
      <Box mt={2}>
        {
          loading ? <Loader /> : error ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={notifications ?? []}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => setSelectedRowIds(newSelection)}
            />
        }
      </Box>
    </Box>
  )
}

export default Notifications