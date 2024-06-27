/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@apollo/client';
import { CheckBox, CheckBoxOutlineBlank, Close } from '@mui/icons-material'
import { Autocomplete, Avatar, Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CREATE_PAYMENT } from './graphql/mutation';
import CButton from '../../common/CButton/CButton';
import { COMPANIES } from '../../graphql/query';
import { USERS } from './graphql/query';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const CreatePayment = ({fetchOrderPayment, closeDialog }) => {
  const [errors, setErrors] = useState({});
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([])
  const [payload, setPayload] = useState({
    company: {},
    paymentFor: '',
    paidAmount: '',
    note: '',
  })

  const { loading: companiesLoading } = useQuery(COMPANIES, {
    onCompleted: (res) => {
      setCompanies(res.companies.edges.map(item => ({
        id: item.node.id,
        name: item.node.name,
        email: item.node.email,
        logoUrl: item.node.logoUrl
      })))
    },
  });

  const { loading: usersLoading } = useQuery(USERS, {
    variables: {
      company: payload.company?.id
    },
    onCompleted: (res) => {
      setUsers(res.users.edges.map(item => ({
        id: item.node.id,
        username: item.node.username,
        photoUrl: item.node.photoUrl,
        dueAmount: item.node.dueAmount,
        email: item.node.email
      })))
    },
  });


  const [createPayment, { loading }] = useMutation(CREATE_PAYMENT, {
    onCompleted: (res) => {
      toast.success(res.createPayment.message)
      fetchOrderPayment()
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


  const handleSave = () => {
    if (!payload.company) {
      setErrors({ company: 'Please select a Company!' })
      return
    }
    if (!payload.paidAmount) {
      setErrors({ paidAmount: 'Please select Amount!' })
      return
    }
    createPayment({
      variables: {
        input: {
          ...payload,
          company: payload.company.id,
          paymentFor: payload.paymentFor.id
        }
      }
    })
  }


  return (
    <Box>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Create Payment</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      {/* company select */}
      <Autocomplete
        sx={{ mb: 2 }}
        options={companies}
        loading={companiesLoading}
        onChange={(_, value) => setPayload({ ...payload, company: value })}
        getOptionLabel={(option) => option.email}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Stack direction='row' gap={2}>
              <Avatar src={option.logoUrl ?? ''} />
              <Box>
                <Typography>{option.name}</Typography>
                <Typography sx={{ fontSize: '12px' }}>{option.email}</Typography>
              </Box>
            </Stack>
          </li>
        )}
        renderInput={(params) => (
          <TextField error={Boolean(errors.company)} helperText={errors.company} {...params} label="Payment for (Company)" />
        )}
      />

      {/* user select */}
      <Autocomplete
        sx={{ mb: 2 }}
        options={users}
        loading={usersLoading}
        onChange={(_, value) => setPayload({ ...payload, paymentFor: value })}
        getOptionLabel={(option) => option.email}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Stack direction='row' gap={2}>
              <Avatar src={option.photoUrl ?? ''} />
              <Box>
                <Typography sx={{ fontSize: '14px' }}> <b>Email: </b> {option.email}</Typography>
                <Typography sx={{ fontSize: '14px' }}><b>Username: </b>{option.username}</Typography>
                <Typography sx={{ fontSize: '14px' }}> <b>Due: </b> {option.dueAmount}</Typography>
              </Box>
            </Stack>

          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Payment for (User)" />
        )}
      />

      <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          onChange={e => setPayload({ ...payload, paidAmount: e.target.value })}
          error={Boolean(errors.paidAmount)}
          helperText={errors.paidAmount}
          label='Amount'
          type='number'
        />
        <TextField
          onChange={e => setPayload({ ...payload, note: e.target.value })}
          label='Note'
          multiline
          rows={3}
        />
      </FormGroup>

      <CButton isLoading={loading} onClick={handleSave} variant='contained' style={{ width: '100%', mt: 2 }}>
        Confirm
      </CButton>

    </Box>
  )
}

export default CreatePayment