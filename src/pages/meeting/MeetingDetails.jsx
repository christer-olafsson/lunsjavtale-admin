/* eslint-disable react/prop-types */
import { Close, AccessTime, Person, Email, Phone, Title, Description, Topic } from '@mui/icons-material'
import { Box, Divider, IconButton, Stack, Typography, Paper, Chip, Grid } from '@mui/material'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import React from 'react'

const MeetingDetails = ({ data, closeDialog }) => {
  const StatusChip = ({ status }) => (
    <Chip
      label={`Status: ${status}`}
      color={status === 'attended' ? 'success' : status === 'postponed' ? 'error' : 'warning'}
      sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
    />
  )

  const InfoItem = ({ icon, label, value, link }) => (
    <Box display="flex" alignItems="center" mb={1}>
      {icon}
      <Typography variant="body1" ml={1}>
        <strong>{label}:</strong>{' '}
        {link ? (
          <Link to={link} target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>
            {value}
          </Link>
        ) : (
          value
        )}
      </Typography>
    </Box>
  )

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Meeting Details</Typography>
        <IconButton onClick={closeDialog} size="large">
          <Close />
        </IconButton>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {data.company && (
            <Box mb={2}>
              <InfoItem
                icon={<Person color="primary" />}
                label="Customer"
                value={data.company.name}
                link={`/dashboard/customers/details/${data.company.id}`}
              />
              <InfoItem
                icon={<Email color="primary" />}
                label="Email"
                value={data.company.email}
              />
            </Box>
          )}
          <StatusChip status={data.status} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            icon={<AccessTime color="primary" />}
            label="Created On"
            value={`${format(data?.createdOn, 'dd-MM-yyyy')} ${format(data?.createdOn, 'hh:mm a')}`}
          />
          <InfoItem
            icon={<AccessTime color="primary" />}
            label="Meeting Time"
            value={`${format(data?.meetingTime, 'dd-MM-yyyy')} ${format(data?.meetingTime, 'hh:mm a')}`}
          />
        </Grid>
      </Grid>

      {data.note && (
        <Paper variant="outlined" sx={{ p: 2, my: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>Note:</Typography>
          <Typography variant="body1">{data.note}</Typography>
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoItem icon={<Title color="primary" />} label="Meeting Title" value={data?.title} />
          <InfoItem icon={<Description color="primary" />} label="Meeting Type" value={data?.meetingType} />
          <InfoItem icon={<Description color="primary" />} label="Description" value={data?.description} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={1} display="flex" alignItems="center">
              <Topic color="primary" sx={{ mr: 1 }} />
              Topics:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              {data.topics.edges.map(item => (
                <Typography component="li" key={item.node.id}>{item.node.name}</Typography>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MeetingDetails