/* eslint-disable react/prop-types */
import { CheckBox, CheckBoxOutlineBlank, Close, CloudUpload } from '@mui/icons-material'
import { Autocomplete, Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { GET_ALL_CATEGORY } from '../../graphql/query';
import { useQuery } from '@apollo/client';


const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const userList = [
  { name: 'Olivia Taylor', username: 'olivia43' },
  { name: 'Phoenix Baker', username: 'phoenix34' },
  { name: 'Lana Steiner', username: 'lana43' },
];



const EditMeeting = ({ closeDialog }) => {
  const [allCategories, setAllCategories] = useState([])

  const { loading, error } = useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      const res = data?.categories?.edges
      setAllCategories(res)
    },
  });

  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>New Meeting</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        {/* customer name */}
        <Autocomplete
          sx={{ mb: 2 }}
          disablePortal
          options={userList}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Customer Name" />}
          renderOption={(props, option) => (
            <Stack direction='row' gap={2} alignItems='center' my={1.5} {...props}>
              <Avatar />
              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{option.name}</Typography>
                <Typography sx={{ fontSize: '14px' }}>{option.username}</Typography>
              </Box>
            </Stack>
          )}
        />
        {/* meeting topic */}
        <Autocomplete
          multiple
          options={allCategories ? allCategories : []}
          disableCloseOnSelect
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
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <TextField fullWidth type='date' helperText='Metting Date' />
          <TextField fullWidth type='time' helperText='Metting Time' />
        </Stack>
        <Stack direction='row' gap={2}>
          <FormControl fullWidth>
            <InputLabel>Meeting Type</InputLabel>
            <Select
              label="Meeting Type"
            >
              <MenuItem value={20}>Remote</MenuItem>
              <MenuItem value={30}>Interview</MenuItem>
              <MenuItem value={40}>Lively</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Attendees</InputLabel>
            <Select
              label="Attendees"
            >
              <MenuItem value={20}>Owner</MenuItem>
              <MenuItem value={30}>Manager</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <TextField sx={{ mt: 2 }} label='Description' multiline rows={3} placeholder='Meeting Description' />
      </FormGroup>

      <Button variant='contained' sx={{ width: '100%', mt: 2 }}>
        Save and Add
      </Button>

    </Box>
  )
}

export default EditMeeting