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

  console.log(notifications)
  return (
    <Stack className='custom-scrollbar' justifyContent={notifications?.length === 0 ? 'center' : 'none'} sx={{
      width: { xs: '300px', sm: '300px', md: '350px' },
      overflowY: 'auto',
      zIndex: 99999,
      // minHeight: '500px',
      bgcolor: '#fff',
      border: '1px solid lightgray',
      borderRadius: '8px',
      boxShadow: 3,
      px: '20px',
      pt: 2
    }} gap={1}>
      {
        loading ? <Loader /> : error ? <ErrorMsg /> :
          notifications?.length === 0 ?
            <Typography sx={{ textAlign: 'center', color: 'gray' }}>No Notification</Typography> :
            notifications?.slice(0, 5).map(item => (
              <Link className='link' key={item.id}
                to={item.notificationType === 'order-placed' ?
                  '/dashboard/orders' :
                  item.notificationType === 'vendor-product-added' ?
                    `/dashboard/food-item/details/${item.objectId}` :
                    item.notificationType === 'vendor-product-ordered' ?
                      '/dashboard/sales-history' :
                      item.notificationType === 'order-status-changed' ?
                        `/dashboard/orders/details/${item.objectId}` : null
                }
              >
                <Box sx={{
                  // borderBottom: '1px solid lightgray',
                  p: 1,
                  boxShadow: 3,
                  borderRadius: '4px',
                  bgcolor: item.isSeen ? '#fff' : '#F5F5F5'
                }} >
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: item.isSeen ? 'gray' : 'green' }}>{item.title}</Typography>
                  <Typography onClick={onClose} sx={{ fontSize: '14px', color: item.isSeen ? 'gray' : 'inherit' }}>{item.message}</Typography>
                  <Stack direction='row' alignItems='center' gap={.5} >
                    <QueryBuilder sx={{ fontSize: '12px' }} />
                    <Typography sx={{ fontSize: '12px' }}>{getTimeDifference(item.sentOn)}</Typography>
                  </Stack>
                </Box>
              </Link>
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