import React, { useState } from 'react'
import { Box, Stack, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, FormHelperText, TextField, Autocomplete, Checkbox, ListItemIcon, ListItemText } from '@mui/material'
import { CheckBox, CheckBoxOutlineBlank, Close } from '@mui/icons-material'
import CButton from '../../common/CButton/CButton'
import { useMutation, useQuery } from '@apollo/client'
import { PRODUCTS, WEEKLY_VARIANTS } from './graphql/query'
import { WEEKLY_VARIANT_PRODUCTS } from './graphql/mutation'
import toast from 'react-hot-toast'

const AddWeeklyFood = ({ fetchCategory, closeDialog }) => {
  const [errors, setErrors] = useState({})
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [allWeeklyVariants, setAllWeeklyVariants] = useState([])
  const [selectedWeeklyVariantId, setSelectedWeeklyVariantId] = useState(null)

  useQuery(WEEKLY_VARIANTS, {
    onCompleted: (res) => {
      const data = res.weeklyVariants.edges.map(item => item.node)
      setAllWeeklyVariants(data)
    },
  });


  useQuery(PRODUCTS, {
    onCompleted: (res) => {
      const data = res.products.edges.map(item => item.node)
      setProducts(data)
    },
  });

  const [weeklyVarianMutation, { loading: loadingMutation }] = useMutation(WEEKLY_VARIANT_PRODUCTS, {
    onCompleted: (res) => {
      console.log(res)
      fetchCategory()
      closeDialog()
      toast.success(res.weeklyVariantProducts.message)
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


  function handleSubmit() {
    if (!selectedWeeklyVariantId) {
      setErrors({ ...errors, weeklyVariants: 'Please select weekly variant' })
      return
    }

    if (selectedProducts.length === 0) {
      setErrors({ ...errors, products: 'Please select products' })
      toast.error('Please select products')
      return
    }

    const productsId = selectedProducts.map(item => item.id)
    weeklyVarianMutation({
      variables: {
        id: selectedWeeklyVariantId,
        products: productsId
      }
    })
  }
  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Add Weekly Food</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack gap={2}>
        <FormControl error={Boolean(errors.weeklyVariants)} >
          <InputLabel>Weekly Variants</InputLabel>
          <Select
            value={selectedWeeklyVariantId || ''}
            label="Weekly Variants"
            onChange={(e) => setSelectedWeeklyVariantId(e.target.value)}
          >
            {allWeeklyVariants?.map(item => (
              <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
          {errors.weeklyVariants && <FormHelperText>{errors.weeklyVariants}</FormHelperText>}
        </FormControl>

        <Autocomplete
          options={products}
          disabled={!selectedWeeklyVariantId}
          value={selectedProducts}
          // error={Boolean(errors.products)}
          multiple
          disableCloseOnSelect
          onChange={(_, value) => setSelectedProducts(value)}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li key={option.id} {...optionProps}>
                <Checkbox
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={<CheckBox fontSize="small" />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <ListItemIcon>
                  <img
                    src={option.attachments.edges[0] ?
                      option.attachments.edges.find(item => item.node.isCover)?.node.fileUrl : ''}
                    alt={option.name} style={{ width: 60, height: 60, objectFit: 'contain', marginRight: '10px' }} />
                </ListItemIcon>
                <ListItemText primary={option.name} secondary={option.category.name} />
                <ListItemText primary={'Price'} secondary={option.priceWithTax} />
              </li>
            )
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Food" />
          )}
        />
        <CButton isLoading={loadingMutation} style={{ width: '100%' }} variant='contained' onClick={handleSubmit}>Add</CButton>
      </Stack>
    </Box>
  )
}

export default AddWeeklyFood