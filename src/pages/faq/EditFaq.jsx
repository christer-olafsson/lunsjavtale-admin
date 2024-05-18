/* eslint-disable react/prop-types */
import { CheckBox, CheckBoxOutlineBlank, Close } from '@mui/icons-material'
import { Box, FormControlLabel, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { GET_ALL_CATEGORY } from '../../graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { FAQ_MUTATION } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;


const EditFaq = ({ data, fetchFAQ, closeDialog }) => {
  const [allCategories, setAllCategories] = useState();
  const [errors, setErrors] = useState({})
  const [payload, setPayload] = useState({
    category: Number,
    question: '',
    answer: '',
    isActive: true
  })

  const [FAQMutation, { loading }] = useMutation(FAQ_MUTATION, {
    onCompleted: (res) => {
      fetchFAQ()
      toast.success(res.FAQMutation.message)
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

  useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      const res = data?.categories?.edges
      setAllCategories(res.map(item => ({
        id: item.node.id,
        name: item.node.name
      })))
    },
  });

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  };

  const handleSave = () => {
    if (!payload.question) {
      setErrors({ question: 'Field Empty!' })
      return
    }
    if (!payload.answer) {
      setErrors({ answer: 'Field Empty!' })
      return
    }
    FAQMutation({
      variables: {
        input: {
          id: data.id,
          ...payload
        }
      }
    })
  }

  useEffect(() => {
    setPayload({
      category: Number,
      question: data.question,
      answer: data.answer,
      isActive: data.isActive ? data.isActive : false
    })
  }, [data])


  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Add New FAQ's</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack flex={1} gap={2}>
        {/* <Autocomplete
          disablePortal
          options={allCategories}
          getOptionLabel={(option) => option.name}
          onChange={(event, value) => setPayload({ ...payload, category: parseInt(value.id) })}
          renderInput={(params) => <TextField {...params} label="Meeting Topic" />}
        /> */}
        <TextField helperText={errors.question} error={Boolean(errors.question)} value={payload.question} onChange={handleInputChange} name='question' label='Question' />
        <TextField helperText={errors.answer} error={Boolean(errors.answer)} value={payload.answer} onChange={handleInputChange} name='answer' label='Answer' multiline rows={6} />
        {/* <FormControlLabel control={<Switch onChange={(e) => setPayload({ ...payload, isActive: e.target.checked })} checked={payload.isActive} />} label="Show in Home page " /> */}
      </Stack>
      <CButton isLoading={loading} onClick={handleSave} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Add </CButton>

    </Box>
  )
}

export default EditFaq