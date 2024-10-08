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
import useIsMobile from '../../hook/useIsMobile';

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const isMobile = useIsMobile()

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
      field: 'Message',
      width: isMobile ? 400 : undefined,
      flex: isMobile ? undefined : 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Message</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Link
              style={{ color: row.isSeen ? 'gray' : 'inherit' }}
              to={row.notificationType === 'order-placed' ? '/dashboard/orders' :
                row.notificationType === 'vendor-product-ordered' ? '/dashboard/sales-history' :
                  row.notificationType === 'order-status-changed' ? `/dashboard/orders/details/${row.objectId}` : ''
              }
            >
              <Typography sx={{ fontSize: '14px' }}>{row.message}</Typography>
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
              noRowsLabel='No notifications found'
            />
        }
      </Box>
    </Box>
  )
}

export default Notifications