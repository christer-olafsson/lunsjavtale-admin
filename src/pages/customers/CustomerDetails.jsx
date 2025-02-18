import { useLazyQuery, useQuery } from '@apollo/client'
import { Add, DescriptionOutlined, Download, LockOutlined, West } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Tab, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { COMPANY } from './graphql/query'
import { useEffect, useState } from 'react'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import CustomersList from './CustomersList'
import { format } from 'date-fns'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CustomerOrders from './CustomerOrders'
import InvoiceTemplate, { downloadPDF } from '../invoice/InvoiceTemplate'
import CDialog from '../../common/dialog/CDialog'
import CreatePayment from '../orders/CreatePayment'

const CustomerDetails = () => {
  const [company, setCompany] = useState({})
  const [value, setValue] = useState('1');
  const [openCreatePaymentDialog, setOpenCreatePaymentDialog] = useState(false)
  const [openSlideDrawer, setOpenSlideDrawer] = useState(false);


  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpenSlideDrawer(!openSlideDrawer);
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const { id } = useParams()
  const navigate = useNavigate()

  const { loading: loadingCompany, error: companyErr } = useQuery(COMPANY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id
    },
    onCompleted: (res) => {
      setCompany(res.company)
    },
  });


  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' alignItems='center' gap={2} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <West />
        </IconButton>
        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Customer Details</Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Box />
        <Stack direction='row' gap={2}>
          <Button disabled={company?.balance === '0.00'} startIcon={<Add />} onClick={() => setOpenCreatePaymentDialog(true)} variant='outlined'>Payment</Button>
          <Button
            size='small'
            onClick={() => downloadPDF()}
            variant='contained'
            disabled={company?.balance === '0.00'}
            // onClick={toggleDrawer}
            startIcon={<Download />

            }>
            Invoice
          </Button>
        </Stack>

      </Stack>

      {/* create payment */}
      <CDialog openDialog={openCreatePaymentDialog}>
        <CreatePayment customerPayment data={company} closeDialog={() => setOpenCreatePaymentDialog(false)} />
      </CDialog>

      {/* invoice page */}
      {/* <SlideDrawer openSlideDrawer={openSlideDrawer} toggleDrawer={toggleDrawer}> */}
      <InvoiceTemplate data={company} toggleDrawer={toggleDrawer} />
      {/* </SlideDrawer> */}

      {
        loadingCompany ? <Loader /> : companyErr ? <ErrorMsg /> :
          <Box>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems='center' justifyContent='space-between'>
              <Stack direction='row' gap={2} mb={5} >
                <img style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }} src={company?.logoUrl ? company?.logoUrl : "/noImage.png"} alt="" />
                <Box>
                  <Typography variant='h5' sx={{ display: 'inline-flex', gap: 1, mb: 1 }}>Customer: <b>{company?.name}</b> <LockOutlined sx={{
                    display: company?.isBlocked ? 'block' : 'none',
                    color: 'red'
                  }} /> </Typography>
                  {
                    company?.createdOn &&
                    <Typography>Joined On: <b>{format(company?.createdOn, 'dd-MM-yyyy')}</b> </Typography>
                  }
                  <Typography>Email: <b>{company?.email}</b> </Typography>
                  <Typography>Phone: <b>{company?.contact}</b> </Typography>
                  <Typography>Post Code: <b>{company?.postCode}</b> </Typography>
                  <Typography>Total Employee: <b>{company?.totalEmployee}</b> </Typography>
                  <Typography>Added Employee: <b>{company?.users?.edges.length}</b> </Typography>
                </Box>
              </Stack>
              <Stack gap={2}>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  bgcolor: company?.balance === '0.00' ? 'lightgray' : '#F7DCD9',
                  color: company?.balance === '0.00' ? 'inherit' : 'red',
                  borderRadius: '4px',
                  textAlign: 'center',
                  p: 1
                }}>
                  <i>Total Due: </i>
                  {company?.balance ?? '00'} <span style={{ fontWeight: 400 }}>kr</span>
                </Typography>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  bgcolor: company?.orderedAmount === '0.00' ? 'lightgray' : 'primary.light',
                  color: company?.orderedAmount === '0.00' ? 'inherit' : '#fff',
                  borderRadius: '4px',
                  textAlign: 'center',
                  p: 1
                }}>
                  <i>Ordered Amount: </i>
                  {company?.orderedAmount ?? '00'} <span style={{ fontWeight: 400 }}>kr</span>
                </Typography>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  bgcolor: company?.paidAmount === '0.00' ? 'lightgray' : 'green',
                  color: company?.paidAmount === '0.00' ? 'inherit' : '#fff',
                  borderRadius: '4px',
                  textAlign: 'center',
                  p: 1
                }}>
                  <i>Paid Amount: </i>
                  {company?.paidAmount ?? '00'} <span style={{ fontWeight: 400 }}>kr</span>
                </Typography>
              </Stack>
              <Stack gap={2} sx={{
                width: { xs: '100%', md: '30%' },
                px: { xs: 0, md: 3 }
              }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, }}>Owner Information</Typography>
                <Typography>Name: <b>{company?.owner?.firstName}</b> </Typography>
                {company?.owner?.username &&
                  <Typography>User Name: <b>@{company?.owner?.username}</b> </Typography>
                }
                <Typography>Email: <b>{company?.owner?.email}</b> </Typography>
                <Typography>Phone: <b>{company?.owner?.phone}</b> </Typography>
                <Typography>Address: <b>{company?.owner?.address}</b> </Typography>
              </Stack>

            </Stack>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Orders" value="1" />
                    <Tab label="Staffs" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <CustomerOrders loading={loadingCompany} error={companyErr} data={company} />
                </TabPanel>
                <TabPanel value="2">
                  <CustomersList data={company} />
                </TabPanel>
              </TabContext>
            </Box>
          </Box>
      }
    </Box>
  )
}

export default CustomerDetails