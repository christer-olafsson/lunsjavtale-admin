/* eslint-disable react/prop-types */
import { CheckBox, CheckBoxOutlineBlank, Close, CloudUpload } from '@mui/icons-material'
import { Autocomplete, Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { GET_ALL_CATEGORY } from '../../graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { VALID_AREA_MUTATION } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';



const EditArea = ({data,fetchValidAreas, closeDialog }) => {
  const [errors, setErrors] = useState({})
  const [payload, setPayload] = useState({
    name:'',
    postCode:'',
    isActive: true
  })

  const [validAreaMutation, { loading }] = useMutation(VALID_AREA_MUTATION, {
    onCompleted: (res) => {
      fetchValidAreas()
      toast.success(res.validAreaMutation.message)
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
    setPayload({...payload, [e.target.name]: e.target.value})
  }

  
  const handleSave = () => {
    if(!payload.postCode){
      setErrors({postCode: 'PostCode empty!'})
      return
    }
    validAreaMutation({
      variables: {
        input: {
          id: data.id,
          ...payload,
          postCode: parseInt(payload.postCode)
        }
      }
    })
  }

  useEffect(() => {
    setPayload({
      name:data.name ? data.name : '',
      postCode:data.postCode,
      isActive: data.isActive ? data.isActive : false
    })
  }, [data])
  

  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Edit Area</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>
      <TextField  value={payload.name} name='name' onChange={handleInputChange} fullWidth label='Area Name' />
      <Stack direction='row' gap={2} mb={2} mt={2}>
        <TextField helperText={errors.postCode} error={Boolean(errors.postCode)} value={payload.postCode}  name='postCode' onChange={handleInputChange} fullWidth type='number' label='Post Code' />
        <FormControlLabel control={<Switch onChange={e=> setPayload({...payload, isActive: e.target.checked})} checked={payload.isActive} />} label="Active" />
      </Stack>

      <CButton isLoading={loading} onClick={handleSave} variant='contained' style={{ width: '100%', mt: 2 }}>
        Save and Update
      </CButton>

    </Box>
  )
}

export default EditArea