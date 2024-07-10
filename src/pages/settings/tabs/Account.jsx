import { KeyboardArrowLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FilledInput, IconButton, Input, InputAdornment, InputLabel, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import { ACCOUNT_PROFILE_UPDATE, PASSWORD_RESET } from '../graphql/mutation';
import CButton from '../../../common/CButton/CButton';
import { ME } from '../../../graphql/query';

const Account = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [payloadEditOn, setPayloadEditOn] = useState(false);
  const [errors, setErrors] = useState([])
  const [passwordErr, setPasswordErr] = useState(null);
  const [forgotePassSecOpen, setForgotePassSecOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState({ email: '' });
  const [editOn, setEditOn] = useState(false)
  const [payload, setPayload] = useState({
    username: '',
    currentPass: '',
    newPass: '',
    repeatPass: ''
  })

  const { data: user } = useQuery(ME);

  // Account Update
  const [accountUpdate, { loading: updateLoading }] = useMutation(ACCOUNT_PROFILE_UPDATE, {
    onCompleted: (res) => {
      const data = res.accountProfileUpdate
      toast.success(data.message);
      setPayloadEditOn(false)
      setErrors({})
    },
    onError: (err) => {
      toast.error(err.message)
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          setErrors(Object.values(extensions.errors));
        }
      }
    }
  });

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }

  const handleUpdate = () => {
    if (payload.newPass !== payload.repeatPass) {
      setPasswordErr('Password not match!')
      return;
    } else {
      setPasswordErr(null)
    }
    accountUpdate({
      variables: {
        input: {
          username: payload.username,
          currentPassword: payload.currentPass,
          password: payload.repeatPass,
          id: user?.me.id
        }
      }
    })
  }

  // Forgote Password
  const [passwordReset, { loading: passResetLoading, data: passResetData }] = useMutation(PASSWORD_RESET, {
    onCompleted: () => {
      // toast.success(res.passwordResetMail.message)
      setForgotEmail({ email: '' })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleForgotePassword = () => {
    if (!forgotEmail.email) {
      toast.error('Please enter your email!')
      return;
    }
    passwordReset({
      variables: {
        email: forgotEmail.email
      }
    })
  }



  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setPayload({
      ...payload,
      username: user?.me?.username
    });
    setForgotEmail({ email: user?.me.email })
  }, [user])

  return (
    <Stack>
      <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 1 }}>Account Settings</Typography>
      <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>View and update your account  details</Typography>
      {
        forgotePassSecOpen ?
          <Stack sx={{
            width: { xs: '100%', md: '480px' },
            justifyContent: 'center',
          }}>
            <Stack sx={{ width: '100%' }} direction='row' alignItems='center' justifyContent={'space-between'}>

              <Button onClick={() => setForgotePassSecOpen(false)} sx={{
                color: 'gray',
                my: 2,
              }} startIcon={<KeyboardArrowLeft />}> Back </Button>
            </Stack>
            {
              passResetData ?
                <Typography sx={{
                  bgcolor: 'light.main',
                  borderRadius: '8px',
                  px: 2, py: 1, color: 'primary.main'
                }}>{passResetData.passwordResetMail.message}</Typography> :
                <Stack>
                  <Typography sx={{ fontWeight: 600, fontSize: '25px', mb: 3 }}>Forgote Password?</Typography>
                  <Input value={forgotEmail.email} sx={{ mb: 2 }} placeholder='Enter Your Email' onChange={(e) => setForgotEmail({ email: e.target.value })} type="text" />
                  {/* <TextField onChange={(e)=> setForgotEmail(e.target.value)} sx={{ mb: 2 }} fullWidth placeholder='email address' variant="outlined" /> */}
                  <CButton isLoading={passResetLoading} disable={passResetLoading} onClick={handleForgotePassword} variant='contained'>Submit</CButton>
                </Stack>
            }
          </Stack> :
          <Stack>
            {/* <InputLabel sx={{ mt: 3, fontWeight: 600 }}>Username</InputLabel> */}
            {/* <Input disabled={!editOn} name='username' value={payload.username} onChange={handleInputChange} startAdornment={
              <InputAdornment position="start">
                <Typography>Lunsjavtale.no/</Typography>
              </InputAdornment>
            }
            /> */}
            <InputLabel sx={{ mt: 3 }}>Current password</InputLabel>
            <Input disabled={!editOn} name='currentPass' value={payload.currentPass} onChange={handleInputChange} variant='standard' />
            <InputLabel sx={{ mt: 3 }}>New Password</InputLabel>
            <Input
              disabled={!editOn}
              type={showPassword ? 'text' : 'password'}
              variant='standard'
              name='newPass'
              value={payload.newPass}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <InputLabel sx={{ mt: 3 }}>Repeat Password</InputLabel>
            <Input
              disabled={!editOn}
              type={showPassword ? 'text' : 'password'}
              variant='standard'
              name='repeatPass'
              value={payload.repeatPass}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {passwordErr && <Typography sx={{ fontSize: '14px', my: 1, color: 'red' }}>Password not match!</Typography>}
            <Button disabled={!editOn} onClick={() => setForgotePassSecOpen(true)} sx={{ width: 'fit-content', mt: 3 }}>Forget Password?</Button>
            {
              errors.length > 0 &&
              <ul style={{ color: 'red', fontSize: '13px' }}>
                {
                  errors.map((err, id) => (
                    <li key={id}>{err}</li>
                  ))
                }
              </ul>
            }
            <Stack direction='row' mt={2} justifyContent='space-between'>
              <Box></Box>
              {
                editOn ?
                  <Stack direction='row' gap={2} alignItems='center'>
                    <Button onClick={() => setEditOn(false)} variant='outlined'>Cancel</Button>
                    <CButton isLoading={updateLoading} onClick={handleUpdate} variant='contained'>Save Changes</CButton>
                  </Stack>
                  : <Button onClick={() => setEditOn(true)} variant='contained'>Edit</Button>
              }
            </Stack>
          </Stack>
      }

    </Stack>
  )
}

export default Account