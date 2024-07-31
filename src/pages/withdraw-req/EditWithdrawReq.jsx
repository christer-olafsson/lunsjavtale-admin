/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { Close, LocalPhoneOutlined, MailOutlined, PersonOutlineOutlined } from '@mui/icons-material'
import { Box, FormControl, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WITHDRAW_REQ_MUTATION } from './graphql/mutation';
import CButton from '../../common/CButton/CButton';
import { WITHDRAW_REQ } from './graphql/query';


const EditWithdrawReq = ({ data, fetchWithdrawReq, closeDialog }) => {
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    note: '',
    status: 'pending',
    withdrawAmount: '',
  })

  const [withdrawReqMutation, { loading }] = useMutation(WITHDRAW_REQ_MUTATION, {
    refetchQueries: [WITHDRAW_REQ],
    onCompleted: (res) => {
      fetchWithdrawReq()
      toast.success(res.withdrawRequestMutation.message)
      closeDialog()
    },
    onError: (err) => {
      toast.error(err.message)
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          setErrors(extensions.errors)
        }
      }
    }
  });

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }

  const handleUpdate = () => {
    if (!payload.withdrawAmount) {
      setErrors({ withdrawAmount: 'Withdraw Amount Empty!' })
      return
    }
    if (data.id) {
      withdrawReqMutation({
        variables: {
          id: data.id,
          withdrawAmount: payload.withdrawAmount,
          status: payload.status,
          note: payload.note
        }
      })
    }
  }

  useEffect(() => {
    if (data) {
      setPayload({
        note: data.note,
        withdrawAmount: data.withdrawAmount,
        status: data.status
      })
    }
  }, [data])

  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={1}>
        <Typography variant='h5'>Withdraw Requst</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack mb={3}>
        <Typography sx={{
          fontSize: '14px',
          display: 'inline-flex',
          fontWeight: 600,
          alignItems: 'center',
          gap: 1,
        }}>
          <PersonOutlineOutlined sx={{ fontSize: '16px' }} />
          {data.vendor?.name}
        </Typography>
        <Typography sx={{
          fontSize: '14px',
          display: 'inline-flex',
          fontWeight: 600,
          alignItems: 'center',
          gap: 1,
        }}>
          <MailOutlined sx={{ fontSize: '16px' }} />
          {data.vendor?.email}
        </Typography>
        <Typography sx={{
          fontSize: '14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <LocalPhoneOutlined sx={{ fontSize: '16px' }} />
          {data.vendor?.contact}
        </Typography>
      </Stack>

      <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          error={Boolean(errors.withdrawAmount)}
          helperText={errors.withdrawAmount}
          onChange={handleInputChange}
          value={payload.withdrawAmount}
          name='withdrawAmount'
          label='Withdraw Amount'
          type='number'
          inputProps={{ readOnly: true }}
        />
        <FormControl
          error={Boolean(errors.status)} fullWidth>
          <InputLabel >Status</InputLabel>
          <Select
            value={payload.status}
            label="Status"
            onChange={(e) => setPayload({ ...payload, status: e.target.value })}
          >
            <MenuItem value={'accepted'}>Accepted </MenuItem>
            <MenuItem value={'cancelled'}>Cancelled</MenuItem>
            <MenuItem value={'completed'}>Completed</MenuItem>
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>

        <TextField
          multiline
          rows={3}
          error={Boolean(errors.note)}
          helperText={errors.note}
          onChange={handleInputChange}
          value={payload.note}
          name='note'
          label='Note'
        />

      </FormGroup>

      <CButton isLoading={loading} onClick={handleUpdate} variant='contained' style={{ width: '100%', mt: 2 }}>
        Complete
      </CButton>

    </Box>
  )
}

export default EditWithdrawReq