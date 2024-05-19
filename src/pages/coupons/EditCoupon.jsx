/* eslint-disable react/prop-types */
import { CheckBox, CheckBoxOutlineBlank, Close, CloudUpload } from '@mui/icons-material'
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { COMPANIES } from '../../graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { COUPON_MUTATION } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const EditCoupon = ({ data, fetchCoupons, closeDialog }) => {
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({})
  const [payload, setPayload] = useState({
    name: '',
    promoType: '',
    maxUsesLimit: '',
    maxLimitPerUser: '',
    value: '',
    minAmount: '',
    maxAmount: '',
    isActive: true,
    startDate: '',
    endDate: '',
    addedFor: []
  })


  const [couponMutation, { loading: couponMutationLoading }] = useMutation(COUPON_MUTATION, {
    onCompleted: (res) => {
      toast.success(res.couponMutation.message)
      closeDialog()
      fetchCoupons()
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

  const { loading: loadingCompany, error: companyErr } = useQuery(COMPANIES, {
    onCompleted: (res) => {
      setCompanies(res.companies.edges.map(item => ({
        id: item.node.id,
        name: item.node.name,
        email: item.node.email,
        // owner: item.node.owner,
        isValid: item.node.isValid,
        isBlocked: item.node.isBlocked
      })))
    },
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  }

  const handleSave = () => {
    const requiredFields = ['name', 'promoType', 'maxUsesLimit', 'maxLimitPerUser', 'value', 'minAmount', 'startDate', 'endDate'];
    const errors = {};
    requiredFields.forEach(field => {
      if (!payload[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} Empty!`;
      }
    });
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      couponMutation({
        variables: {
          input: {
            id: data.id,
            ...payload,
            maxUsesLimit: parseInt(payload.maxUsesLimit),
            maxLimitPerUser: parseInt(payload.maxLimitPerUser),
            value: parseInt(payload.value),
            minAmount: parseInt(payload.minAmount),
            maxAmount: parseInt(payload.maxAmount),
            addedFor: payload.addedFor.map(item => item.id)
          }
        }
      });
    }
  }

  useEffect(() => {
    setPayload({
      name: data.name,
      promoType: data.promoType.toLowerCase(),
      maxUsesLimit: data.maxUsesLimit,
      maxLimitPerUser: data.maxLimitPerUser,
      value: data.value,
      minAmount: data.minAmount,
      maxAmount: data.maxAmount ? data.maxAmount : '',
      isActive: data.isActive ? data.isActive : false,
      startDate: data.startDate,
      endDate: data.endDate,
      addedFor: data.addedFor ? data.addedFor.edges.map(item => ({
        id: item.node.id,
        name: item.node.name,
        email: item.node.email,
        // owner: item.node.owner,
        isValid: item.node.isValid,
        isBlocked: item.node.isBlocked
      })) : []
    })
  }, [data])


  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Typography variant='h5'>Update Coupon</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack gap={2}>
        <TextField
          value={payload.name}
          onChange={handleInputChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          name='name'
          label='Coupon Title' />
        <Stack direction='row' gap={2}>
          <FormControl
            error={Boolean(errors.promoType)} fullWidth>
            <InputLabel >Promo Code Type</InputLabel>
            <Select
              value={payload.promoType}
              label="Promo Code Type"
              onChange={(e) => setPayload({ ...payload, promoType: e.target.value })}
            >
              <MenuItem value={'percentage'}>Percentage Discount</MenuItem>
            </Select>
            {errors.promoType && <FormHelperText>{errors.promoType}</FormHelperText>}

          </FormControl>
          <TextField
            value={payload.maxUsesLimit}
            onChange={handleInputChange}
            error={Boolean(errors.maxUsesLimit)}
            helperText={errors.maxUsesLimit}
            fullWidth
            name='maxUsesLimit'
            type='number'
            placeholder='00'
            label='Max Uses Limit'
          />
        </Stack>
        <Stack direction='row' gap={2}>
          <TextField
            value={payload.maxLimitPerUser}
            onChange={handleInputChange}
            error={Boolean(errors.maxLimitPerUser)}
            helperText={errors.maxLimitPerUser}
            fullWidth
            name='maxLimitPerUser'
            type='number'
            label='Max Limit Per User'
          />
          <TextField
            value={payload.value}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,3}$/.test(value) && value <= 100) {
                setPayload({ ...payload, value: value });
              }
            }}
            error={Boolean(errors.value)}
            helperText={errors.value}
            name='value'
            fullWidth
            type='number'
            label='Discount Value (1-100%)'
          />
        </Stack>
        <Stack direction='row' gap={2}>
          <TextField
            value={payload.minAmount}
            onChange={handleInputChange}
            error={Boolean(errors.minAmount)}
            helperText={errors.minAmount}
            name='minAmount'
            fullWidth
            type='number'
            label='Min Amount'
          />
          <TextField
            value={payload.maxAmount}
            onChange={handleInputChange}
            error={Boolean(errors.maxAmount)}
            helperText={errors.maxAmount}
            name='maxAmount'
            fullWidth
            type='number'
            label='Max Amount'
          />
        </Stack>

        <Autocomplete
          multiple
          options={companies}
          value={payload.addedFor}
          disableCloseOnSelect
          onChange={(event, value) => setPayload({ ...payload, addedFor: value})}
          getOptionLabel={(option) => (option.name)}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 4 }}
                checked={selected}
              />
              <Stack>
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{option.name}</Typography>
                <Typography sx={{ fontSize: '12px' }}>{option.email}</Typography>
              </Stack>
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Added For" />
          )}
        />

        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Box>
            <Typography variant='body2'>Start Date</Typography>
            <TextField
              value={payload.startDate}
              onChange={handleInputChange}
              error={Boolean(errors.startDate)}
              helperText={errors.startDate}
              name='startDate'
              size='small'
              type='date'
            />
          </Box>
          <Box>
            <Typography variant='body2'>End Date</Typography>
            <TextField
              value={payload.endDate}
              onChange={handleInputChange}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate}
              name='endDate'
              size='small'
              type='date'
            />
          </Box>
        </Stack>
        <FormControlLabel
          checked={payload.isActive}
          onChange={e => setPayload({ ...payload, isActive: e.target.checked })}
          control={<Switch checked={payload.isActive} />}
          label="Status Available"
        />

      </Stack>

      <CButton isLoading={couponMutationLoading} onClick={handleSave} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Update</CButton>
    </Box>
  )
}

export default EditCoupon