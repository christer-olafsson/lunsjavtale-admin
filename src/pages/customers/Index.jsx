import { Add, ApprovalOutlined, BorderColor, DeleteForeverOutlined, DeleteOutlineOutlined, LocationOnOutlined, LockOpenOutlined, LockOutlined, MailOutlined, ModeEditOutlineOutlined, MoreHoriz, Person, PersonOutline, Remove, Search, Store, StoreOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';
import AddCustomer from './AddCustomer';
import CDialog from '../../common/dialog/CDialog';
import EditCustomer from './EditCustomer';
import { useLazyQuery } from '@apollo/client';
import { COMPANIES } from './graphql/query';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';

// const rows = [
//   { id: '987654', ownerName: 'Atlas Freight', email: 'deanna.curtis@example.com',noOfEmployees: '10', isBlocked: false, company: 'Brekke-Willms ' },
//   { id: '987324', ownerName: 'Atlas Freight', email: 'deanna.curtis@example.com',noOfEmployees: '20', isBlocked: true, company: 'Brekke-Willms ' },
// ];


const Customers = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
  const [editCustomerDialogOpen, setEditCustomerDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [editCustomerData, setEditCustomerData] = useState({})


  const [fetchCompany, { loading: loadingCompany, error: companyErr }] = useLazyQuery(COMPANIES, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setCompanies(res.companies.edges)
    },
  });


  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  function handleEdit(row) {
    setEditCustomerDialogOpen(true)
    setEditCustomerData(row)
  }
  function handleDelete(row) {
    setDeleteDialogOpen(true)
  }



  const columns = [
    {
      field: 'companyName', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Company Name</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
          {params.row.logoUrl ? <Avatar sx={{ borderRadius: '4px' }} src={params.row.logoUrl} /> : <StoreOutlined />}
          <Box >
            <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>{params.row.company}</Typography>
            {
              params.row.isValid ?
                <Typography sx={{
                  fontSize: '12px',
                  bgcolor: 'primary.main',
                  px:1,borderRadius:'4px',
                  color: '#fff',
                  width: 'fit-content'
                }}>&#x2022; Available</Typography> :
                <Typography sx={{
                  bgcolor: 'darkgray',
                  px:1,borderRadius:'4px',
                  color: '#fff',
                  fontSize: '12px',
                  width: 'fit-content'
                }}>&#x2022; Not Available</Typography>
            }
          </Box>
        </Stack>
      )
    },
    {
      field: 'email', headerName: '', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Email Address</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} gap={1} direction='row' alignItems='center'>
          <MailOutlined fontSize='small'/>
          <Typography sx={{ fontSize: '14px' }}>{params.row.email}</Typography>
        </Stack>
      )
    },
    {
      field: 'ownerName', width: 250,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Owner Name</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Avatar sx={{ height: '30px', width: '30px' }} src={row.photoUrl ? row.photoUrl : ''} />
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{row.firstName}</Typography>
              {row.username &&
                <Typography sx={{ fontSize: '12px' }}>@{row.username}</Typography>
              }
            </Box>
          </Stack>
        )
      }
    },
    {
      field: 'noOfEmployees', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Employees</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <PersonOutline />
            <Typography sx={{ fontSize: '14px', noOfEmployees: '10' }}>{params.row.noOfEmployees}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'postCode', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Post Code</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <ApprovalOutlined fontSize='small' />
            <Typography sx={{ fontSize: '14px', noOfEmployees: '10' }}>{params.row.postCode}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'status', width: 150,
      renderHeader: (params) => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status </Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
            <Typography sx={{
              fontSize: { xs: '12px', md: '16px' },
              color: row.isBlocked ? 'red' : 'primary.main ',
              bgcolor: 'light.main',
              px: 1, borderRadius: '8px',
            }}>&#x2022; {row.isBlocked ? 'Lock' : 'Active'}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'delete', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => setDeleteDialogOpen(true)} sx={{
            borderRadius: '5px',
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
          }}>
            <DeleteOutlineOutlined fontSize='small' />
          </IconButton>
        )
      },
    },
    // {
    //   field: 'lock', headerName: '', width: 50,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton sx={{
    //         borderRadius: '5px',
    //         width: { xs: '30px', md: '40px' },
    //         height: { xs: '30px', md: '40px' },
    //       }}>
    //         <LockOutlined fontSize='small' sx={{
    //           color: params.row.isBlocked ? 'red' : 'gray'
    //         }} />
    //       </IconButton>
    //     )
    //   },
    // },
    {
      field: 'edit', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton sx={{
            borderRadius: '5px',
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
          }} onClick={() => handleEdit(params.row)}>
            <ModeEditOutlineOutlined fontSize='small' />
          </IconButton>
        )
      },
    },
  ];



  const rows = companies?.map(item => ({
    id: item.node.id,
    company: item.node.name,
    email: item.node.email,
    contact: item.node.contact,
    address: item.node.address,
    postCode: item.node.postCode,
    description: item.node.description,
    isBlocked: item.node.isBlocked,
    noOfEmployees: item.node.noOfEmployees,
    firstName: item.node.owner?.firstName ? item.node.owner?.firstName : '',
    username: item.node.owner?.username,
    photoUrl: item.node.owner?.photoUrl,
    logoUrl: item.node.logoUrl,
    fileId: item.node.fileId,
    isValid: item.node.isValid
  }))

  useEffect(() => {
    fetchCompany()
  }, [])

  // useEffect(() => {
  //   setColumnVisibilityModel({
  //     paymentInfo: isMobile ? false : true,
  //     status: isMobile ? false : true,
  //     deliveryDate: isMobile ? false : true,
  //   })
  // }, [isMobile])

  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' gap={1} alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Customers</Typography>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'primary.main', bgcolor: 'light.main', borderRadius: '4px', px: 1 }}>3 users</Typography>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
        <Stack direction='row' gap={2}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '480px',
            bgcolor: '#fff',
            width: '100%',
            border: '1px solid lightgray',
            borderRadius: '4px',
            pl: 2
          }}>
            <Input fullWidth disableUnderline placeholder='Search.. ' />
            <IconButton><Search /></IconButton>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value={5}>All </MenuItem>
                <MenuItem value={10}>New</MenuItem>
                <MenuItem value={20}>Active</MenuItem>
                <MenuItem value={30}>Locked</MenuItem>
                <MenuItem value={30}>Deleted</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
        <Button onClick={() => setAddCustomerDialogOpen(true)} variant='contained' startIcon={<Add />}>New Customer</Button>
      </Stack>
      {/* edit customer */}
      <CDialog openDialog={editCustomerDialogOpen}>
        <EditCustomer fetchCompany={fetchCompany} data={editCustomerData} closeDialog={() => setEditCustomerDialogOpen(false)} />
      </CDialog>
      {/* add customer */}
      <CDialog openDialog={addCustomerDialogOpen}>
        <AddCustomer fetchCompany={fetchCompany} closeDialog={() => setAddCustomerDialogOpen(false)} />
      </CDialog>
      {/* delete customer */}
      <CDialog closeDialog={() => setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete company</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this company? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <Button onClick={() => setDeleteDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
            <Button fullWidth variant='contained' color='error'>Delete</Button>
          </Stack>
        </Box>
      </CDialog>
      <Box mt={{ xs: 10, md: 3 }}>
        {
          loadingCompany ? <LoadingBar /> : companyErr ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={rows}
              columnVisibilityModel={columnVisibilityModel}
            />
        }
      </Box>
    </Box>
  )
}

export default Customers