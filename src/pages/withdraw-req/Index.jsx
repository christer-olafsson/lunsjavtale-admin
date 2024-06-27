import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { WITHDRAW_REQ } from './graphql/query';
import { Avatar, Box, FormControl, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { DeleteOutlineOutlined, DoneAll, EmailOutlined, LocalPhoneOutlined, MailOutlined, ModeEditOutlineOutlined, Search, StoreOutlined } from '@mui/icons-material';
import LoadingBar from '../../common/loadingBar/LoadingBar';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import DataTable from '../../common/datatable/DataTable';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import CDialog from '../../common/dialog/CDialog';
import EditWithdrawReq from './EditWithdrawReq';

const WithdrawReq = () => {
  const [withdrawReq, setWithdrawReq] = useState([])
  const [searchText, setSearchText] = useState('')
  const [withdrawReqData, setWithdrawReqData] = useState({})
  const [withdrawReqDialogOpen, setWithdrawReqDialogOpen] = useState(false)
  const [status, setStatus] = useState('')

  const [fetchWithdrawReq, { loading: WithdrawReqLoading, error: WithdrawReqErr }] = useLazyQuery(WITHDRAW_REQ, {
    variables: {
      vendorTitle: searchText,
      status
    },
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setWithdrawReq(res.withdrawRequests.edges.map(item => item.node))
    },
  });

  const handleWithdrawReqDialog = (row) => {
    setWithdrawReqDialogOpen(true)
    setWithdrawReqData(row)
  }

  // const [vendorDelete, { loading: deleteLoading }] = useMutation(VENDOR_DELETE, {
  //   onCompleted: (res) => {
  //     fetchVendors()
  //     toast.success(res.vendorDelete.message)
  //     setDeleteDialogOpen(false)
  //   },
  //   onError: (err) => {
  //     toast.error(err.message)
  //   }
  // });

  const columns = [
    {
      field: 'suppliers', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Supplier</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%' }} direction='row' gap={1} alignItems='center'>
          {params.row.vendor.logoUrl ? <Avatar sx={{ borderRadius: '4px' }} src={params.row.logoUrl} /> :
            <StoreOutlined />}
          <Box >
            <Stack direction='row' alignItems='center'>
              <Link to={`/dashboard/suppliers/details/${params.row.vendor.id}`}>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                }}>{params.row.vendor.name}
                </Typography>
              </Link>
            </Stack>
          </Box>
        </Stack>
      )
    },
    {
      field: 'contact', headerName: '', width: 300,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' }, ml: '20px' }}>Contact</Typography>
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
            {params.row.vendor.email}
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <LocalPhoneOutlined sx={{ fontSize: '16px' }} />
            {params.row?.vendor.contact}
          </Typography>
        </Stack>
      )
    },

    {
      field: 'reqOn', headerName: '', width: 200,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Placed On</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontWeight: 600 }} > {format(params.row.createdOn, 'yyyy-MM-dd')}</Typography>
        </Stack >
      )
    },
    {
      field: 'withdrawAmount', headerName: '', width: 150,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Amount</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontWeight: 600 }} > {params.row.withdrawAmount} kr</Typography>
        </Stack >
      )
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
              bgcolor: row.status === 'pending' ? 'yellow'
                : row.status === 'accepted' ? 'lightgreen'
                  : row.status === 'completed' ? 'green'
                    : 'red',
              color: row.status === 'pending' ?
                'dark' : row.status === 'accepted' ?
                  'dark' : row.status === 'completed' ?
                    '#fff' : '#fff',
              px: 1, borderRadius: '8px',
            }}>&#x2022; {row.status}</Typography>
          </Stack>
        )
      }
    },
    {
      field: 'edit', headerName: '', width: 80,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleWithdrawReqDialog(params.row)} sx={{
            borderRadius: '5px',
            width: { xs: '30px', md: '40px' },
            height: { xs: '30px', md: '40px' },
          }}
          >
            <DoneAll sx={{}} fontSize='small' />
          </IconButton>
        )
      },
    },
    {
      field: 'note', headerName: '', flex: 1,
      renderHeader: () => (
        <Typography sx={{ fontSize: { xs: '12px', fontWeight: 600, lg: '15px' } }}>Note</Typography>
      ),
      renderCell: (params) => (
        <Stack sx={{ height: '100%', }} justifyContent='center'>
          <Typography sx={{ fontWeight: 600 }} > {params.row.note}</Typography>
        </Stack >
      )
    },
    // {
    //   field: 'delete', headerName: '', width: 50,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton
    //         // onClick={() => handleDelete(params.row)} 
    //         sx={{
    //           borderRadius: '5px',
    //           width: { xs: '30px', md: '40px' },
    //           height: { xs: '30px', md: '40px' },
    //         }}>
    //         <DeleteOutlineOutlined sx={{ color: params.row.isValid ? 'inherit' : 'darkgray' }} fontSize='small' />
    //       </IconButton>
    //     )
    //   },
    // },
  ];


  useEffect(() => {
    fetchWithdrawReq()
  }, [])


  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' gap={1} alignItems='center'>
        <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>Supplier Withdraw Request</Typography>
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
            <Input onChange={e => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Search.. ' />
            <IconButton><Search /></IconButton>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                onChange={e => setStatus(e.target.value)}
              >
                <MenuItem value={''}>All </MenuItem>
                <MenuItem value={'accepted'}>Accepted </MenuItem>
                <MenuItem value={'cancelled'}>Cancelled</MenuItem>
                <MenuItem value={'completed'}>Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Stack>
      {/* edit  */}
      <CDialog openDialog={withdrawReqDialogOpen}>
        <EditWithdrawReq data={withdrawReqData} fetchWithdrawReq={fetchWithdrawReq} closeDialog={() => setWithdrawReqDialogOpen(false)} />
      </CDialog>
      {/* delete  */}
      {/* <CDialog closeDialog={() => setDeleteDialogOpen(false)} maxWidth='sm' openDialog={deleteDialogOpen}>
        <Box>
          <img src="/Featured icon.png" alt="" />
          <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete company</Typography>
          <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this company? This action cannot be undone.</Typography>
          <Stack direction='row' gap={2} mt={3}>
            <Button onClick={() => setDeleteDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
            <CButton isLoading={deleteLoading} onClick={handleCompanyDelete} style={{ width: '100%' }} variant='contained' color='error'>Delete</CButton>
          </Stack>
        </Box>
      </CDialog> */}
      <Box mt={{ xs: 10, md: 3 }}>
        {
          WithdrawReqLoading ? <LoadingBar /> : WithdrawReqErr ? <ErrorMsg /> :
            <DataTable
              columns={columns}
              rows={withdrawReq}
            />
        }
      </Box>
    </Box>
  )
}

export default WithdrawReq