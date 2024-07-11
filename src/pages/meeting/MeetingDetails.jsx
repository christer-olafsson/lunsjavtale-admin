/* eslint-disable react/prop-types */
import { Close } from '@mui/icons-material'
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const MeetingDetails = ({ data, closeDialog }) => {

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Typography variant='h5'>Meetings Details</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack direction='row' justifyContent='space-between' mb={2}>
        {
          data.company !== null ?
            <Box>
              <Typography> <b>Company: </b>
                <Link to={`/dashboard/customers/details/${data.company?.id}`} target='_blank'>
                  {data.company.name}
                </Link>
              </Typography>

              <Typography variant='body2'><b>Email: </b>{data.company.email}</Typography>
            </Box> :
            <Box />
        }
        <Typography sx={{
          textAlign: 'center',
          height: 'fit-content',
          py: 1,
          fontWeight: 'bold',
          color: data.status === 'attended' ? '#fff' : data.status === 'postponed' ? '#fff' : 'black',
          bgcolor: data.status === 'attended' ? 'primary.main' : data.status === 'postponed' ? 'red' : 'yellow',
          px: 3, borderRadius: '8px',
        }}>&#x2022; {data.status}</Typography>
      </Stack>

      {
        data.note &&
        <Box sx={{
          mb: 2,
          border: '1px solid lightgray',
          p: 2, borderRadius: '4px'
        }}>
          <Typography sx={{ fontWeight: 600 }}>Note: </Typography>
          <Typography variant='body2'>{data.note}</Typography>
        </Box>
      }

      <Stack gap={1}>
        <Typography><b>Submit Time: </b>{format(data?.createdOn, 'yyyy-MM-dd')} <i style={{ fontSize: '12px' }}>{format(data?.createdOn, 'HH:mm')}</i></Typography>
        <Typography><b>Meeting Time: </b>{format(data?.meetingTime, 'yyyy-MM-dd')} <i style={{ fontSize: '12px' }}>{format(data?.meetingTime, 'HH:mm')}</i></Typography>
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Stack direction='row' justifyContent='space-between'>
        <Box flex={1}>
          <Typography><b>Company Name: </b>{data?.companyName}</Typography>
          <Typography><b>Email: </b>{data?.email}</Typography>
          <Typography><b>Phone: </b>{data?.phone}</Typography>
          <Typography><b>First Name: </b>{data?.firstName}</Typography>
          <Typography><b>Last Name: </b>{data?.lastName}</Typography>
          <Typography><b>Meeting Title: </b>{data?.title}</Typography>
          <Typography><b>Meeting Type: </b>{data?.meetingType}</Typography>
          <Typography><b>Description: </b>{data?.description}</Typography>
        </Box>
        <Box flex={1}>
          <Typography> <b>Topic:</b> </Typography>
          <ul>
            {
              data.topics.edges.map(item => (
                <li key={item.node.id}>{item.node.name}</li>
              ))
            }
          </ul>
        </Box>
      </Stack>
    </Box>

  )
}

export default MeetingDetails