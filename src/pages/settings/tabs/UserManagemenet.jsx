import { Add, DeleteOutline, EditOutlined, ErrorOutline, Lock, MoreVert, Search } from '@mui/icons-material'
import { Avatar, Box, Button, IconButton, Input, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import CDialog from '../../../common/dialog/CDialog'
import AddUser from './AddUser'
import EditUser from './EditUser'

const users = [
  {
    name: 'Savannah Nguyen',
    username: 'johnmaina',
    role: 'admin'
  },
  {
    name: 'Cody Fisher',
    username: 'sylviaawuor',
    role: 'Products',
    status: 'available'
  },
  {
    name: 'Jane Cooper',
    username: 'jamo254',
    role: 'Warehouse',
    status: 'lock'
  },
  {
    name: 'Guy Hawkins',
    username: 'cynthia',
    role: 'Inventory',
    status: 'available'
  },
]

const UserManagemenet = () => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDeleteUserId, setSelectedDeleteUserId] = useState('');

  function handleEditUser(id) {
    setSelectedUserId(id)
    setEditUserDialogOpen(true)
  }
  function handleDeleteUser(id) {
    setSelectedDeleteUserId(id)
    setDeleteUserDialogOpen(true)
  }

  return (
    <Box sx={{ minHeight: '600px' }} maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600 }}>User Management </Typography>
      <Stack direction={{xs:'column',md:'row'}} gap={{xs:1,md:3}} justifyContent='space-between' mt={3} sx={{ height: '40px' }}>
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
          }}>
            <IconButton><Search /></IconButton>
            <Input fullWidth disableUnderline placeholder='Search.. ' />
          </Box>
        </Stack>
        <Button onClick={() => setAddUserDialogOpen(true)} variant='contained' startIcon={<Add />}>Add User</Button>
        {/* add user */}
        <CDialog openDialog={addUserDialogOpen}>
          <AddUser closeDialog={() => setAddUserDialogOpen(false)} />
        </CDialog>
      </Stack>

      <Stack direction='row' gap={2} flexWrap='wrap' mt={{xs:10,md:3}}>
        {
          users.map((user, id) => (
            <Paper key={id} elevation={3} sx={{
              width: {xs:'100%',md:'270px'},
              display: 'flex',
              alignItems: 'center',
              gap: 1, p: 2,
              position: 'relative',
              bgcolor: user.status === 'lock' ? '#FEE4E2' : 'none',
              opacity:  user.status === 'lock' ? '.6' : '1',
            }}>
              <Avatar sx={{
                width: '60px',
                height: '60px'
              }} />
              <Box>
                <Typography sx={{ fontSize: '16px', mr: 2, lineHeight: '15px' }}>{user.name}</Typography>
                <Typography sx={{ fontSize: '13px' }}>@{user.username}</Typography>
                <Typography sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: user.role === 'admin' ? 'purple' : 'black'
                }}>{user.role}</Typography>
              </Box>
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}>
                {
                  user.role !== 'admin' &&
                  <Stack direction='row'>
                    <IconButton onClick={() => handleEditUser(id)}>
                      <EditOutlined fontSize='small' />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(id)}>
                      <DeleteOutline fontSize='small' />
                    </IconButton>
                  </Stack>
                }
              </Box>
              <Box sx={{
                position: 'absolute',
                top: 10, right: 10,
                display: user.status === 'lock' ? 'block' : 'none'
              }}>
                <Lock sx={{color:'red'}} />
              </Box>
              {/*edit */}
              {
                selectedUserId === id &&
                <CDialog openDialog={editUserDialogOpen}>
                  <EditUser closeDialog={() => setEditUserDialogOpen(false)} />
                </CDialog>
              }
              {/* delete */}
              {
                selectedDeleteUserId === id &&
                <CDialog closeDialog={() => setDeleteUserDialogOpen(false)} maxWidth='sm' openDialog={deleteUserDialogOpen}>
                  <Box>
                    <ErrorOutline fontSize='large' sx={{ color: 'red' }} />
                    <Typography sx={{ fontSize: { xs: '18px', lg: '22px' }, fontWeight: 600 }}>Delete this User?</Typography>
                    <Typography sx={{ fontSize: '14px', mt: 1 }}>Are you sure you want to delete this user? This action cannot be undone.</Typography>
                    <Stack direction='row' gap={2} mt={3}>
                      <Button onClick={() => setDeleteUserDialogOpen(false)} fullWidth variant='outlined'>Cancel</Button>
                      <Button fullWidth variant='contained' color='error'>Delete</Button>
                    </Stack>
                  </Box>
                </CDialog>
              }
            </Paper>
          ))
        }
      </Stack>

    </Box>
  )
}

export default UserManagemenet