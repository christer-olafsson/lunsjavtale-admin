import { Add, ArrowRightOutlined, DeleteForeverOutlined, LockOutlined, ModeEditOutlineOutlined, Search } from '@mui/icons-material'
import { Avatar, Box, Button, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import DataTable from '../../common/datatable/DataTable';
import AddSupplier from './AddSupplier';
import CDialog from '../../common/dialog/CDialog';
import { useEffect, useState } from 'react';
import EditSupplier from './EditSupplier';
import { VENDORS } from './graphql/query';
import { useLazyQuery, useMutation } from '@apollo/client';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import { format } from 'date-fns';
import { VENDOR_DELETE } from './graphql/mutation';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const rows = [
  { id: '987654', supplierName: 'Fcorp - Futures Enterprise', username: 'Supplier C', phone: '(+33)7 75 55 65 33', email: 'deanna.curtis@example.com', joiningDate: 'May 6, 2012', totalRevenue: '32000', status: 'Active' },
  { id: '977654', supplierName: 'Fcorp - Futures Enterprise', username: 'Supplier C', phone: '(+33)7 75 55 65 33', email: 'deanna.curtis@example.com', joiningDate: 'May 6, 2012', totalRevenue: '32000', status: 'Active' },
  { id: '976654', supplierName: 'Fcorp - Futures Enterprise', username: 'Supplier C', phone: '(+33)7 75 55 65 33', email: 'deanna.curtis@example.com', joiningDate: 'May 6, 2012', totalRevenue: '32000', status: 'Active' },
];


const Suppliers = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [addSupplierDialogOpen, setAddSupplierDialogOpen] = useState(false);
  const [editSupplierDialogOpen, setEditSupplierDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorEditData, setVendorEditData] = useState({})
  const [vendorDeleteId, setVendorDeleteId] = useState('')
  const [vendors, setVendors] = useState([])
  const [searchText, setSearchText] = useState('')

  const [fetchVendors, { loading, error: vendorsErr }] = useLazyQuery(VENDORS, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setVendors(res.vendors.edges.map(item => item.node))
    }
  })

  const [vendorDelete, { loading: deleteLoading }] = useMutation(VENDOR_DELETE, {
    onCompleted: (res) => {
      fetchVendors()
      toast.success(res.vendorDelete.message)
      setDeleteDialogOpen(false)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleVendorDelete = () => {
    vendorDelete({
      variables: {
        id: vendorDeleteId
      }
    })
  }

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  function handleEdit(row) {
    setEditSupplierDialogOpen(true)
    setVendorEditData(row)
  }
  function handleDelete(row) {
    setDeleteDialogOpen(true)
    setVendorDeleteId(row.id)
  }
console.log(vendors)
  const columns = [
    {
      field: 'details', width: 70, headerName: '',
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} justifyContent='center'>
            <Link to={`/dashboard/suppliers/details/${row.id}`}>
              <IconButton>
                <ArrowRightOutlined />
              </IconButton>
            </Link>
          </Stack>
        )
      }
    },
    {
      field: 'supplierName', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Suppliers</Typography>
      ),
      renderCell: (params) => {
        const { row } = params;
        return (
          <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
            <Avatar src={row.logoUrl} />
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{row.name}</Typography>
              {/* <Typography sx={{ fontSize: '13px', }}>{params.row.firstName}</Typography> */}
            </Box>
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
              fontSize: { xs: '12px', md: '14px' },
              bgcolor: row.isBlocked ? 'lightgray' : 'primary.main',
              color: row.isBlocked ? 'red' : '#fff',
              px: 1, borderRadius: '4px',
            }}>&#x2022; {row.isBlocked ? 'Blocked' : 'Active'}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'phone', headerName: '', width: 170,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Phone</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px' }}>{params.row.contact}</Typography>
        </Stack>
      )
    },
    {
      field: 'email', headerName: '', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Email</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px' }}>{params.row.email}</Typography>
        </Stack>
      )
    },
    {
      field: 'joiningDate', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Joining Date</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px' }}>{format(params.row.createdOn, 'dd MMMM yyyy')}</Typography>
        </Stack>
      )
    },
    {
      field: 'totalRevenue', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Total Revenue</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', ml: '20px' }} direction='row' alignItems='center'>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>${params.row.soldAMount}</Typography>
        </Stack>
      )
    },
    {
      field: 'delete', headerName: '', width: 50,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDelete(params.row)} sx={{
            borderRadius: '5px',
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
          }}>
            <DeleteForeverOutlined fontSize='small' />
          </IconButton>
        )
      },
    },
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


  useEffect(() => {
    fetchVendors()
  }, [])


  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' gap={1} alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Suppliers</Typography>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'primary.main', bgcolor: 'light.main', borderRadius: '4px', px: 1 }}>
          {vendors.filter(item => !item.isDeleted).length}
          users</Typography>
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
        </Stack>
        <Button onClick={() => setAddSupplierDialogOpen(true)} variant='contained' startIcon={<Add />}>Add New Supplier</Button>
      </Stack>
      {/* add  */}
      <CDialog openDialog={addSupplierDialogOpen}>
        <AddSupplier fetchVendors={fetchVendors} closeDialog={() => setAddSupplierDialogOpen(false)} />
      </CDialog>
      {/* edit  */}
      <CDialog openDialog={editSupplierDialogOpen}>
        <EditSupplier fetchVendors={fetchVendors} data={vendorEditData} closeDialog={() => setEditSupplierDialogOpen(false)} />
      </CDialog>
      {/* delete  */}
      <CDialog closeDialog={() => setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete Supplier</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this supplier? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <Button onClick={() => setDeleteDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
            <Button disabled={deleteLoading} onClick={handleVendorDelete} fullWidth variant='contained' color='error'>Delete</Button>
          </Stack>
        </Box>
      </CDialog>
      <Box mt={{ xs: 10, md: 3 }}>
        {
          loading ? <LoadingBar /> : vendorsErr ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={vendors.filter(item => !item.isDeleted)}
            />
        }
      </Box>
    </Box>
  )
}

export default Suppliers