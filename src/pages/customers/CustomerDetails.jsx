import { useLazyQuery, useQuery } from '@apollo/client'
import { LockOutlined, West } from '@mui/icons-material'
import { Box, IconButton, Stack, Tab, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { COMPANY } from './graphql/query'
import { useEffect, useState } from 'react'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import CustomersList from './CustomersList'
import { format } from 'date-fns'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CustomerOrders from './CustomerOrders'

const CustomerDetails = () => {
  const [company, setCompany] = useState({})
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const { id } = useParams()
  const navigate = useNavigate()

  const [fetchCompany, { loading: loadingCompany, error: companyErr }] = useLazyQuery(COMPANY, {
    fetchPolicy: 'network-only',
    variables: {
      id
    },
    onCompleted: (res) => {
      setCompany(res.company)
    },
  });

  useEffect(() => {
    fetchCompany()
  }, [])

  console.log(company)

  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' alignItems='center' gap={2} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <West />
        </IconButton>
        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>Customer Details</Typography>
      </Stack>
      {
        loadingCompany ? <Loader /> : companyErr ? <ErrorMsg /> :
          <Box>
            <Stack direction={{ xs: 'column', lg: 'row' }} alignItems='center' justifyContent='space-between'>
              <Stack direction='row' gap={2} mb={5} alignItems='center'>
                <img style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }} src={company?.logoUrl ? company?.logoUrl : "/noImage.png"} alt="" />
                <Box>
                  {
                    company?.createdOn &&
                    <Typography>Joined On: <b>{format(company?.createdOn, 'dd-MM-yyyy')}</b> </Typography>
                  }
                  <Typography sx={{ display: 'inline-flex', gap: 1 }}>Customer: <b>{company?.name}</b> <LockOutlined sx={{
                    display: company?.isBlocked ? 'block' : 'none',
                    color: 'red'
                  }} /> </Typography>
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
                <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 2 }}>Owner Information</Typography>
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
                  <CustomerOrders fetchOrders={fetchCompany} loading={loadingCompany} error={companyErr} data={company} />
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