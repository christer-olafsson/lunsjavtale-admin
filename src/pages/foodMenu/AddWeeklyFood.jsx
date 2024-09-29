import React, { useEffect, useState } from 'react'
import { Box, Stack, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, FormHelperText, TextField, Autocomplete, Checkbox, ListItemIcon, ListItemText } from '@mui/material'
import { CheckBox, CheckBoxOutlineBlank, Close } from '@mui/icons-material'
import CButton from '../../common/CButton/CButton'
import { useMutation, useQuery } from '@apollo/client'
import { PRODUCTS, WEEKLY_VARIANTS } from './graphql/query'
import { WEEKLY_VARIANT_PRODUCTS } from './graphql/mutation'
import toast from 'react-hot-toast'
import { useFetcher } from 'react-router-dom'

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


  const { loading: productsLoading } = useQuery(PRODUCTS, {
    onCompleted: (res) => {
      const data = res.products?.edges?.map(item => ({
        attachments: item.node.attachments,
        category: item.node.category,
        id: item.node.id,
        name: item.node.name,
        priceWithTax: item.node.priceWithTax,
        weeklyVariants: item.node.weeklyVariants.edges
      }))
      setProducts(data)
    },
  });

  const [weeklyVarianMutation, { loading: loadingMutation }] = useMutation(WEEKLY_VARIANT_PRODUCTS, {
    onCompleted: (res) => {
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

    // if (selectedProducts.length === 0) {
    //   setErrors({ ...errors, products: 'Please select products' })
    //   toast.error('Please select products')
    //   return
    // }

    weeklyVarianMutation({
      variables: {
        id: selectedWeeklyVariantId,
        products: selectedProducts.map(item => item.id)
      }
    })
  }

  useEffect(() => {
    if (products.length > 0) {
      setSelectedProducts(products.filter(item => item.weeklyVariants && item.weeklyVariants.length > 0).map(item => ({
        attachments: item.attachments || [],
        category: item.category,
        id: item.id,
        name: item.name,
        priceWithTax: item.priceWithTax,
        weeklyVariants: item.weeklyVariants.map(item => item.node)
      })))
    }
  }, [products])

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
              <MenuItem key={item?.id} value={item?.id}>{item?.name}</MenuItem>
            ))}
          </Select>
          {errors.weeklyVariants && <FormHelperText>{errors.weeklyVariants}</FormHelperText>}
        </FormControl>

        <Autocomplete
          options={products}
          disabled={!selectedWeeklyVariantId}
          value={selectedProducts}
          loading={productsLoading}
          // error={Boolean(errors.products)}
          multiple
          disableCloseOnSelect
          onChange={(_, value) => setSelectedProducts(value)}
          getOptionLabel={(option) => option?.name || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option, { selected }) => {
            if (!option) return null;
            return (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={<CheckBox fontSize="small" />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <ListItemIcon>
                  <img
                    src={option.attachments?.edges?.length > 0 ?
                      option.attachments.edges.find(item => item.node.isCover)?.node.fileUrl || '/noImage.png' : '/noImage.png'}
                    alt={option.name || ''}
                    style={{ width: 60, height: 60, objectFit: 'contain', marginRight: '10px' }}
                  />
                </ListItemIcon>
                {/* <ListItemText primary={option.name || ''} secondary={option.category?.name} /> */}
                <ListItemText
                  primary={option?.name || ''}
                  secondary={option.weeklyVariants && option.weeklyVariants.length > 0
                    ? option.weeklyVariants.map(item => item?.node.name || '').join(', ')
                    : null}
                />
                <ListItemText sx={{ display: { xs: 'none', sm: 'flex' } }} primary={option.category?.name} secondary={option.priceWithTax + ' kr' || ''} />
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