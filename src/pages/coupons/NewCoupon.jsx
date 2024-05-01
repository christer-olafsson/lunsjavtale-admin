/* eslint-disable react/prop-types */
import { Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";



const NewCoupon = ({ closeDialog }) => {
  const [couponImg, setCouponImg] = useState(null);
  const [promoCodeUsePerUse, setPromoCodeUsePerUse] = useState('')
  const [promoCodeType, setPromoCodeType] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());



  return (
    <Box sx={{
      p: { xs: 0, md: 2 }
    }}>

      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>New Coupon</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <FormGroup>
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <Stack flex={1} gap={2}>
            <TextField label='Coupon Title' />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Promo Code Type</InputLabel>
              <Select
                value={promoCodeType}
                label="Promo Code Type"
                onChange={(e) => setPromoCodeType(e.target.value)}
              >
                <MenuItem value={20}>Percentage Discount</MenuItem>
              </Select>
            </FormControl>
            <TextField placeholder='00' label='Maximum Discount Amount ($)' />
            <TextField placeholder='00' label='Promo Code Quanatity' />
          </Stack>
          <Stack flex={1} gap={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Promo Code Usage Per User</InputLabel>
              <Select
                value={promoCodeUsePerUse}
                label="Promo Code Usage Per User"
                onChange={(e) => setPromoCodeUsePerUse(e.target.value)}
              >
                <MenuItem value={20}>Unlimited</MenuItem>
              </Select>
            </FormControl>
            <TextField placeholder='00' label='Discount (%)' />
            <TextField placeholder='00' label='Maximum Order Values ' />
          </Stack>
        </Stack>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Box>
            <Typography>Start Date</Typography>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          </Box>
          <Box>
            <Typography>End Date</Typography>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          </Box>
        </Stack>
        <Stack direction='row' gap={2} mt={2}>
          <FormControlLabel control={<Switch defaultChecked />} label="Status Available" />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mt={2}>
          {
            couponImg && <Box sx={{
              flex: 1
            }}>
              <Box sx={{
                width: '100%',
                height: '114px'
              }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src={couponImg ? URL.createObjectURL(couponImg) : ''} alt="" />
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
                <input onChange={(e) => setCouponImg(e.target.files[0])} type="file" hidden />
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

export default NewCoupon