import { useQuery } from '@apollo/client';
import { QueryBuilder } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import { ADMIN_NOTIFICATIONS } from './graphql/query';
import { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';

const SmallNotification = ({ onClose }) => {
  const [notifications, setNotifications] = useState([])

  const { loading, error } = useQuery(ADMIN_NOTIFICATIONS, {
    onCompleted: (res) => {
      setNotifications(res.adminNotifications.edges.map(item => item.node))
    }
  });

  const getTimeDifference = (isoString) => {
    const date = parseISO(isoString);
    return formatDistanceToNow(date, { addSuffix: true });
  };


  return (
    <Stack sx={{
      width: { xs: '300px', sm: '300px', md: '350px' },
      overflowY: 'auto',
      zIndex: 99999,
      bgcolor: '#fff',
      border: '1px solid lightgray',
      borderRadius: '8px', p: '10px 20px',
    }} gap={2}>
      {
        loading ? <Loader /> : error ? <ErrorMsg /> :
          notifications?.length === 0 ?
            <Typography sx={{ textAlign: 'center', color: 'gray' }}>No Notification</Typography> :
            notifications?.slice(0, 5).map(item => (
              <Box key={item.id}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'green' }}>{item.title}</Typography>
                <Typography sx={{ fontSize: '14px' }}>{item.message}</Typography>
                <Stack direction='row' alignItems='center' gap={.5} >
                  <QueryBuilder sx={{ fontSize: '12px' }} />
                  <Typography sx={{ fontSize: '12px' }}>{getTimeDifference(item.sentOn)}</Typography>
                </Stack>
              </Box>
            ))
      }
      {
        notifications?.length !== 0 &&
        <Link to='/dashboard/notifications'>
          <Button onClick={onClose}>See All</Button>
        </Link>
      }
    </Stack>
  )
}

export default SmallNotification