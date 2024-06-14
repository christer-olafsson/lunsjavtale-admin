/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import { Close } from '@mui/icons-material'
import { Box, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ADD_NEW_ADMINISTRATOR } from '../graphql/mutation';
import CButton from '../../../common/CButton/CButton';


const EditUser = ({fetchSystemUsers, data, closeDialog }) => {
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    username: '',
    email: '',
    role: '',
    superUser: false,
  })
  console.log(data)
  const [newAdministrator, { loading }] = useMutation(ADD_NEW_ADMINISTRATOR, {
    onCompleted: (res) => {
      fetchSystemUsers()
      toast.success(res.addNewAdministrator.message)
      closeDialog()
    },
    onError: (err) => {
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

  const handleSave = async () => {
    if (!payload.email) {
      setErrors({ email: 'Email required!' })
      return
    }
    if (!payload.username) {
      setErrors({ username: 'User name required!' })
      return
    }
    if (!payload.role) {
      setErrors({ role: 'User role required!' })
      return
    }
    if (data.id) {
      newAdministrator({
        variables: {
          input: {
            id: data.id,
            ...payload
          }
        }
      })
    }
  }

  useEffect(() => {
    if (data) {
      setPayload({
        username: data.username,
        email: data.email,
        role: data.role,
        superUser: data.isSuperuser ?? false,
      })
    }
  }, [data])



  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Update User</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          error={Boolean(errors.email)}
          helperText={errors.email}
          onChange={handleInputChange}
          value={payload.email}
          name='email'
          label='Email'
        />
        <TextField
          error={Boolean(errors.username)}
          helperText={errors.username}
          onChange={handleInputChange}
          value={payload.username}
          name='username'
          label='User name'
        />
        <Stack direction='row' gap={2}>
          <FormControl
            error={Boolean(errors.role)} fullWidth>
            <InputLabel >Role</InputLabel>
            <Select
              value={payload.role}
              label="Role"
              onChange={(e) => setPayload({ ...payload, role: e.target.value })}
            >
              <MenuItem value={'sub-admin'}>Sub Admin</MenuItem>
              <MenuItem value={'editor'}>Editor</MenuItem>
              <MenuItem value={'developer'}>Developer</MenuItem>
              <MenuItem value={'seo-manager'}>SEO Manager</MenuItem>
              <MenuItem value={'system-manager'}>System Manager</MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>
          <FormControlLabel
            control={<Switch onChange={e => setPayload({ ...payload, superUser: e.target.checked })}
              checked={payload.superUser} />} label="SuperUser" />
        </Stack>

      </FormGroup>

      <CButton isLoading={loading} onClick={handleSave} variant='contained' style={{ width: '100%', mt: 2 }}>
        Save and Update
      </CButton>

    </Box>
  )
}

export default EditUser