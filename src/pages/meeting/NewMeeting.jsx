import { useMutation, useQuery } from '@apollo/client';
import { Autocomplete, Box, Checkbox, FormControl, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import toast from 'react-hot-toast';
import { CheckBox, CheckBoxOutlineBlank, Close } from '@mui/icons-material';
import { useState } from 'react';
import { GET_ALL_CATEGORY } from '../foodMenu/graphql/query';
import { MEETING_MUTATION } from './graphql/mutation';
import CButton from '../../common/CButton/CButton';
import { COMPANIES } from '../../graphql/query';
import { Link } from 'react-router-dom';
import { FOOD_MEETINGS } from './graphql/query';
import { format } from 'date-fns';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const NewMeeting = ({ fetchMeeting, closeDialog }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [companies, setCompanies] = useState([])
  const [errors, setErrors] = useState({})
  const [payload, setPayload] = useState({
    title: '',
    meetingTime: '',
    topics: [],
    meetingType: '',
    description: '',
    company: {
      id: '',
      name: '',
      email: ''
    }
  })

  useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      const res = data?.categories?.edges
      setAllCategories(res)
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

  const handleDateTimeChange = (e) => {
    const selectedDate = new Date(e.target.value);
    // Format the date as 'YYYY-MM-DDTHH:mm:ssXXX' (ISO 8601 format)
    const formattedDate = format(selectedDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    setPayload({ ...payload, meetingTime: formattedDate });
  };

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
    meetingMutation({
      variables: {
        input: {
          ...payload,
          company: payload.company.id
        }
      }
    })
  }
  return (
    <FormGroup>
      <Stack >
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={3}>
          <Typography variant='h5'>Create Meeting</Typography>
          <IconButton sx={{ alignSelf: 'flex-end' }} onClick={closeDialog}><Close /></IconButton>
        </Stack>
        <TextField sx={{ mb: 2 }} error={Boolean(errors.title)} helperText={errors.title} onChange={handleInputChange} name='title' label='Title' />
        <Autocomplete
          options={companies ?? []}
          value={payload.company}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => setPayload({ ...payload, company: value })}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Box>
                <Link style={{ width: 'fit-content' }} to={`/dashboard/customers/details/${option.id}`} target='_blank'>
                  <Typography>{option.name}</Typography>
                </Link>
                <Typography sx={{ fontSize: '13px' }}>{option.email}</Typography>
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField error={Boolean(errors.company)} helperText={errors.company} {...params} label="For (Customer)" />
          )}
        />
        <Stack direction='row' gap={2} my={2}>
          <Stack flex={1} gap={2}>
            <FormControl error={Boolean(errors.meetingType)} fullWidth>
              <InputLabel>Meeting Type</InputLabel>
              <Select
                label="Meeting Type"
                onChange={(e) => setPayload({ ...payload, meetingType: e.target.value })}
              >
                <MenuItem value={'remote'}>Remote</MenuItem>
                <MenuItem value={'interview'}>Interview</MenuItem>
                <MenuItem value={'in-person'}>In Person</MenuItem>
              </Select>
              {errors.meetingType && <FormHelperText>{errors.meetingType}</FormHelperText>}
            </FormControl>
          </Stack>
        </Stack>
        <Box mb={2}>
          <Typography value={payload.meetingTime} variant='body2'>Meeting Time</Typography>
          <TextField onChange={handleDateTimeChange} error={Boolean(errors.meetingTime)} helperText={errors.meetingTime} fullWidth type='datetime-local' />
        </Box>
        <Stack gap={2}>
          <Autocomplete
            multiple
            options={allCategories ? allCategories : []}
            disableCloseOnSelect
            onChange={(event, value) => setPayload({ ...payload, topics: value.map(item => item.node.id) })}
            getOptionLabel={(option) => option.node.name}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.node.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Meeting Topic" />
            )}
          />

        </Stack>
        <TextField error={Boolean(errors.description)} helperText={errors.description} onChange={handleInputChange} name='description' sx={{ my: 2 }} label='Description' rows={4} multiline />
        <CButton onClick={handleCreate} isLoading={meetingLoading} variant='contained'>Create Meeting</CButton>
      </Stack>
    </FormGroup>
  )
}

export default NewMeeting