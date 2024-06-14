/* eslint-disable react/prop-types */
import { Close } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useMutation } from '@apollo/client';
import { MEETING_RESOLVE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';


const MeetingAction = ({ data, fetchMeeting, closeDialog }) => {
  const [errors, setErrors] = useState({})
  const [payload, setPayload] = useState({
    note: '',
    status: ''
  })

  const [meetingResolve, { loading }] = useMutation(MEETING_RESOLVE, {
    onCompleted: (res) => {
      fetchMeeting()
      toast.success(res.foodMeetingResolve.message)
      closeDialog()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleSave = () => {
    if (!payload.status) {
      setErrors({ status: 'Status Empty!' })
      toast.error('Meeting Status Required!')
      return
    }
    meetingResolve({
      variables: {
        id: data.id,
        note: payload.note,
        status: payload.status
      }
    })
  }

  useEffect(() => {
    if (data) {
      setPayload({
        status: data.status,
        note: data.note
      })
    }
  }, [data])


  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Update Meeting</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>
      <Stack direction='row' gap={2}>
        <FormControl fullWidth>
          <InputLabel>Meeting Status</InputLabel>
          <Select
            label="Meeting Type"
            error={Boolean(errors.status)}
            value={payload.status}
            onChange={e => setPayload({ ...payload, status: e.target.value })}
          >
            <MenuItem value={'attended'}>Attended</MenuItem>
            <MenuItem value={'postponed'}>Postponed</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <TextField
        value={payload.note}
        fullWidth sx={{ mt: 2 }}
        onChange={e => setPayload({ ...payload, note: e.target.value })}
        label='Note'
        multiline
        rows={3}
        placeholder='Meeting Note'
      />
      <CButton onClick={handleSave} isLoading={loading} variant='contained' style={{ width: '100%', mt: 2 }}>
        Save and Add
      </CButton>

    </Box>
  )
}

export default MeetingAction