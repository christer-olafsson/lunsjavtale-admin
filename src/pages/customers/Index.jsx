import { Add, ApprovalOutlined, BorderColor, DeleteForeverOutlined, DeleteOutlineOutlined, DoneAllOutlined, FmdBadOutlined, KeyboardArrowRight, LocalPhoneOutlined, LocationOffOutlined, LocationOnOutlined, LockOpenOutlined, LockOutlined, MailOutlined, ModeEditOutlineOutlined, MoreHoriz, Person, PersonOutline, PriorityHighOutlined, Remove, RemoveDoneOutlined, RoomOutlined, Search, Store, StoreOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DataTable from '../../common/datatable/DataTable';
import AddCustomer from './AddCustomer';
import CDialog from '../../common/dialog/CDialog';
import EditCustomer from './EditCustomer';
import { useLazyQuery, useMutation } from '@apollo/client';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import { COMPANIES } from '../../graphql/query';
import { COMPANY_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import CButton from '../../common/CButton/CButton';
import useIsMobile from '../../hook/useIsMobile';


const Customers = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
  const [editCustomerDialogOpen, setEditCustomerDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [editCustomerData, setEditCustomerData] = useState({})
  const [deleteCompanyId, setDeleteCompanyId] = useState('')
  const [searchText, setSearchText] = useState('')

  const isMobile = useIsMobile()

  const [fetchCompany, { loading: loadingCompany, error: companyErr }] = useLazyQuery(COMPANIES, {
    variables: {
      nameEmail: searchText,
      status: statusFilter === 'all' ? null : statusFilter
    },
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setCompanies(res.companies.edges)
    },
  });

  const [companyDelete, { loading: deleteLoading }] = useMutation(COMPANY_DELETE, {
    refetchQueries: [COMPANIES],
    onCompleted: (res) => {
      fetchCompany()
      toast.success(res.companyDelete.message)
      setDeleteDialogOpen(false)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });


  function handleEdit(row) {
    setEditCustomerDialogOpen(true)
    setEditCustomerData(row)
  }
  function handleDelete(row) {
    setDeleteDialogOpen(true)
    setDeleteCompanyId(row.id)
  }

  function handleCompanyDelete() {
    companyDelete({
      variables: {
        id: parseInt(deleteCompanyId)
      }
    })
  }


  const columns = [
    {
      field: 'details', headerName: 'ID', width: 60,
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} justifyContent='center'>
          <Link to={`/dashboard/customers/details/${params.row.id}`}>
            {/* <KeyboardArrowRight /> */}
            {params.row.id}
          </Link>
        </Stack>
      )
    },
    {
      field: 'companyName', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Company Name</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
          {params.row.logoUrl ? <Avatar sx={{ borderRadius: '4px' }} src={params.row.logoUrl} /> :
            <StoreOutlined />}
          <Box >
            <Stack direction='row' alignItems='center'>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 600,
                // color: params.row.isValid ? 'inherit' : 'darkgray',
                display: 'inline-flex',
                gap: '3px'
              }}>{!params.row.isChecked &&
                <span style={{ fontSize: '14px', color: 'green' }}>(new)</span>
                }
                {params.row.company}
              </Typography>
              {!params.row.isValid && <PriorityHighOutlined sx={{ color: 'red' }} fontSize='small' />}
              {
                params.row.isBlocked &&
                <LockOutlined fontSize='small' sx={{
                  color: params.row.isBlocked ? 'red' : 'gray'
                }} />
              }
            </Stack>
          </Box>
        </Stack>
      )
    },
    {
      field: 'info', headerName: '', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Company Info</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} justifyContent='center'>
          <Typography sx={{
            fontSize: '14px',
            display: 'inline-flex',
            fontWeight: 600,
            alignItems: 'center',
            gap: 1,
          }}>
            <MailOutlined sx={{ fontSize: '16px' }} />
            {params.row.email}
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <LocalPhoneOutlined sx={{ fontSize: '16px' }} />
            {params.row?.contact}
          </Typography>
        </Stack>
      )
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
            {
              row.isValid ?
                <RoomOutlined sx={{ color: 'primary.main' }} fontSize='small' /> :
                <LocationOffOutlined sx={{ color: 'darkgray' }} fontSize='small' />

            }
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: row.isValid ? 'primary.main' : 'darkgray'
            }}>{params.row.postCode}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'dueAmount',
      headerName: '',
      width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Due Amount</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 600,
              bgcolor: row.dueAmount === '0.00' ? 'lightgray' : '#F7DCD9',
              color: row.dueAmount === '0.00' ? 'black' : 'red',
              borderRadius: '4px',
              textAlign: 'center',
              p: .5
            }}>{row.dueAmount ?? <b>00 </b>} kr</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'paidAmount',
      headerName: '',
      width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px', ml: 5 } }}>Paid Amount</Typography>
      ),
      renderCell: (params) => {
        const { row } = params
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 600,
            }}>{row.paidAmount ?? <b>00 </b>} kr</Typography>
          </Stack>
        )
      }
    },
    // {
    //   field: 'status', width: 150,
    //   renderHeader: (params) => (
    //     <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Status </Typography>
    //   ),
    //   renderCell: (params) => {
    //     const { row } = params
    //     return (
    //       <Stack sx={{ height: '100%' }} direction='row' alignItems='center'>
    //         <Typography sx={{
    //           fontSize: { xs: '12px', md: '16px' },
    //           color: '#fff',
    //           bgcolor: row.isBlocked ? 'red' : 'green',
    //           px: 1, borderRadius: '4px',
    //         }}>{row.isBlocked ? 'Locked' : 'Active'}</Typography>
    //       </Stack>
    //     )
    //   }
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
    {
      field: 'delete', headerName: '',
      width: isMobile ? 50 : undefined,
      flex: isMobile ? undefined : 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDelete(params.row)} sx={{
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
    //       <LockOutlined fontSize='small' sx={{
    //         color: params.row.isBlocked ? 'red' : 'gray'
    //       }} />
    //     )
    //   },
    // },
  ];



  const rows = companies?.map(item => ({
    id: item.node.id,
    company: item.node.name,
    email: item.node.email,
    ownerEmail: item.node.owner?.email,
    contact: item.node.contact,
    address: item.node.address,
    postCode: item.node.postCode,
    description: item.node.description,
    isBlocked: item.node.isBlocked,
    noOfEmployees: item.node.noOfEmployees,
    addedEmployees: item.node.users?.edges.length,
    firstName: item.node.owner?.firstName ? item.node.owner?.firstName : '',
    username: item.node.owner?.username,
    photoUrl: item.node.owner?.photoUrl,
    logoUrl: item.node.logoUrl,
    fileId: item.node.fileId,
    isValid: item.node.isValid,
    isChecked: item.node.isChecked,
    dueAmount: item.node.balance,
    invoiceAmount: item.node.invoiceAmount,
    paidAmount: item.node.paidAmount,
  }))

  useEffect(() => {
    fetchCompany()
  }, [])

  return (
    <Box maxWidth='xl'>
      <Stack direction='row' gap={1} alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Customers</Typography>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'primary.main', bgcolor: 'light.main', borderRadius: '4px', px: 1 }}>{rows?.length} Customers</Typography>
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
            <Input onChange={e => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Name / Email' />
            <IconButton><Search /></IconButton>
          </Box>
          {/* <Box sx={{ minWidth: 200 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value={'all'}>All </MenuItem>
                <MenuItem value={'active'}>Active</MenuItem>
                <MenuItem value={'rejected'}>rejected</MenuItem>
              </Select>
            </FormControl>
          </Box> */}
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
            <CButton isLoading={deleteLoading} onClick={handleCompanyDelete} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
          </Stack>
        </Box>
      </CDialog>
      <Box mt={{ xs: 10, md: 3 }}>
        {
          loadingCompany ? <LoadingBar /> : companyErr ? <ErrorMsg /> :
            <DataTable
              rowHeight={70}
              columns={columns}
              rows={rows}
            />
        }
      </Box>
    </Box>
  )
}

export default Customers