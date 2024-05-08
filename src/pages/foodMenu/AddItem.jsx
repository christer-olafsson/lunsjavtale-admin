/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@apollo/client';
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { CREATE_PRODUCT } from './graphql/mutation'
import { GET_ALL_CATEGORY } from './graphql/query';


const AddItem = ({ closeDialog }) => {
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('');
  const [productImg, setProductImg] = useState(null);
  const [errors, setErrors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [payload, setPayload] = useState({
    name: '',
    category: '',

  })


  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT, {
    onCompleted: (res) => {
      console.log('create product res:', res)
      // fetchCategory()
      // toast.success(res.categoryMutation.message)
      closeDialog()
    },
    onError: (err) => {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          // setErrors(extensions.errors)
          setErrors(Object.values(extensions.errors));
        }
      }
    }
  });

  console.log('errors:', errors)

  useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      setAllCategories(data?.categories?.edges)
    },
  });

  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Add New Items</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <TextField label='Product Name' />
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <Stack flex={1} gap={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {
                  allCategories?.map(item => (
                    <MenuItem key={item.node.id} value={item.node.id}>{item.node.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <TextField label='Price (excl. Tax)' />
          </Stack>
          <Stack flex={1} gap={2}>
            {/* <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Currency</InputLabel>
              <Select
                value={currency}
                label="Currency"
                onChange={(e) => setCurrency(e.target.value)}
              >
                <MenuItem value={20}>NOK</MenuItem>
              </Select>
            </FormControl> */}
            <TextField label='Tax(15%)' type='number' />
            <TextField label='Price (incl. Tax)' />

          </Stack>
        </Stack>
        <TextField label='Description' placeholder='Products details' rows={4} multiline />
        <Stack direction='row' gap={2} mt={2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Status Available" />
          <FormControlLabel control={<Switch color="warning" defaultChecked />} label="Discount Active" />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2}>
          {
            productImg && <Box sx={{
              flex: 1
            }}>
              <Box sx={{
                width: '100%',
                height: '114px'
              }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src={productImg ? URL.createObjectURL(productImg) : ''} alt="" />
              </Box>
            </Box>
          }
          <Box sx={{
            flex: 1
          }}>
            <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
              <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose files (jpg,png)</Typography>
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                // tabIndex={-1}
                startIcon={<CloudUpload />}
              >
                Upload file
                <input onChange={(e) => setProductImg(e.target.files[0])} type="file" hidden />
                {/* <VisuallyHiddenInput type="file" /> */}
              </Button>
            </Stack>
          </Box>
        </Stack>

      </FormGroup>

      <Button variant='contained' sx={{ width: '100%', mt: 2 }}>
        Save and Add
      </Button>

    </Box>
  )
}

export default AddItem