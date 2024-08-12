/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@apollo/client';
import { Autocomplete, Box, Checkbox, FormControl, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import toast from 'react-hot-toast';
import { CheckBox, CheckBoxOutlineBlank, Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { GET_ALL_CATEGORY } from '../foodMenu/graphql/query';
import { MEETING_MUTATION } from './graphql/mutation';
import CButton from '../../common/CButton/CButton';
import { COMPANIES } from '../../graphql/query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FOOD_MEETINGS } from './graphql/query';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const EditMeeting = ({ data, fetchMeeting, closeDialog }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [companies, setCompanies] = useState([])
  const [errors, setErrors] = useState({})
  const [payload, setPayload] = useState({
    title: '',
    meetingTime: '',
    topics: [],
    meetingType: '',
    description: '',
    company: ''
  })

  useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      setAllCategories(data?.categories?.edges.map(item => ({
        id: item.node.id,
        name: item.node.name
      })))
    },
  });

  useQuery(COMPANIES, {
    onCompleted: (res) => {
      setCompanies(res.companies.edges.map(item => ({
        id: item.node.id,
        name: item.node.name,
        email: item.node.email
      })))
    },
  });

  const [meetingMutation, { loading: meetingLoading }] = useMutation(MEETING_MUTATION, {
    refetchQueries: [FOOD_MEETINGS],
    onCompleted: (res) => {
      toast.success(res.foodMeetingMutation.message)
      fetchMeeting()
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

  const handleCreate = () => {
    if (!payload.title) {
      setErrors({ title: 'Meeting Title Required!' })
      return
    }
    if (!payload.company) {
      setErrors({ company: 'Company Required!' })
      return
    }
    if (!payload.meetingType) {
      setErrors({ meetingType: 'Meeting Type Required!' })
      return
    }
    if (!payload.meetingTime) {
      setErrors({ meetingTime: 'Meeting Time Required!' })
      return
    }
    if (!payload.description) {
      setErrors({ description: 'Meeting Description Required!' })
      return
    }
    if (data.id) {
      meetingMutation({
        variables: {
          input: {
            id: data.id,
            ...payload,
            company: payload.company.id ?? '',
            topics: payload.topics ? payload.topics?.map(item => item?.id) : []
          }
        }
      })
    }
  }


  useEffect(() => {
    setPayload({
      title: data.title,
      meetingTime: data.meetingTime,
      topics: data.topics.edges.map(item => item.node),
      meetingType: data.meetingType,
      description: data.description ?? '',
      company: {
        id: data.company?.id,
        name: data.company?.name,
        email: data.company?.email
      } ?? {}
    })
  }, [data])


  return (
    <FormGroup>
      <Stack >
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={3}>
          <Typography variant='h5'>Update Meeting</Typography>
          <IconButton sx={{ alignSelf: 'flex-end' }} onClick={closeDialog}><Close /></IconButton>
        </Stack>
        <TextField
          sx={{ mb: 2 }}
          value={payload.title}
          error={Boolean(errors.title)}
          helperText={errors.title}
          onChange={handleInputChange}
          name='title'
          label='Title' />
        <Autocomplete
          sx={{ mb: 2 }}
          value={payload.company ?? {}}
          options={companies ?? []}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name || ''}
          onChange={(_, value) => setPayload({ ...payload, company: value })}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={payload.company ? payload.company?.id === option?.id : false}
              />
              <Box>
                <Link style={{ width: 'fit-content' }} to={`/dashboard/customers/details/${option.id}`} target='_blank'>
                  <Typography>{option?.name}</Typography>
                </Link>
                <Typography sx={{ fontSize: '13px' }}>{option?.email}</Typography>
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="For (Customer)"
              error={Boolean(errors.company)}
              helperText={errors.company}
            />
          )}
        />
        <FormControl sx={{ mb: 2 }} error={Boolean(errors.meetingType)} fullWidth>
          <InputLabel>Meeting Type</InputLabel>
          <Select
            value={payload.meetingType}
            label="Meeting Type"
            onChange={(e) => setPayload({ ...payload, meetingType: e.target.value })}
          >
            <MenuItem value={'remote'}>Remote</MenuItem>
            <MenuItem value={'interview'}>Interview</MenuItem>
            <MenuItem value={'in-person'}>In Person</MenuItem>
          </Select>
          {errors.meetingType && <FormHelperText>{errors.meetingType}</FormHelperText>}
        </FormControl>
        <Box mb={2}>
          <Typography value={payload.meetingTime} variant='body2'>Meeting Time
            <i> ({format(data.meetingTime, 'dd-MM-yyyy HH:mm')})</i>
          </Typography>
          <TextField onChange={(e) => setPayload({ ...payload, meetingTime: e.target.value })} error={Boolean(errors.meetingTime)} helperText={errors.meetingTime} fullWidth type='datetime-local' />
        </Box>
        <Stack gap={2}>
          <Autocomplete
            multiple
            value={payload?.topics}
            options={allCategories}
            disableCloseOnSelect
            onChange={(event, value) => setPayload({ ...payload, topics: value })}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Meeting Topic" />
            )}
          />

        </Stack>
        <TextField
          value={payload.description}
          error={Boolean(errors.description)}
          helperText={errors.description}
          onChange={handleInputChange}
          name='description'
          sx={{ my: 2 }}
          label='Description'
          rows={4}
          multiline
        />
        <CButton onClick={handleCreate} isLoading={meetingLoading} variant='contained'>Update Meeting</CButton>
      </Stack>
    </FormGroup>
  )
}

export default EditMeeting