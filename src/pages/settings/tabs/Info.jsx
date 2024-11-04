import { CloudUpload, LinkedIn } from '@mui/icons-material'
import { Box, Button, FormControl, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DEFAULT_MUTATION } from '../graphql/mutation'
import { useLazyQuery, useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { uploadFile } from '../../../utils/uploadFile'
import { deleteFile } from '../../../utils/deleteFile'
import { CLIENT_DETAILS } from '../graphql/query'
import CButton from '../../../common/CButton/CButton'

const Info = () => {
  const [logo, setLogo] = useState('')
  const [cover, setCover] = useState('')
  const [clientDetails, setClientDetails] = useState({})
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [socialLinkJson, setSocialLinkJson] = useState({})
  const [editOn, setEditOn] = useState(false)
  const [socialPayload, setSocialPayload] = useState({
    facebook: '',
    instagram: '',
    linkedIn: '',
    youtube: ''
  })
  const [payload, setPayload] = useState({
    address: '',
    contact: '',
    email: '',
    formationDate: '',
    logoUrl: '',
    name: '',
    slogan: '',
    coverVideoUrl: ''
  })

  const [fetchClientDetails] = useLazyQuery(CLIENT_DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setClientDetails(res.clientDetails)
    },
  });

  const [defaultMutation, { loading }] = useMutation(DEFAULT_MUTATION, {
    onCompleted: (res) => {
      fetchClientDetails()
      setEditOn(false)
      setLogo('')
      setCover('')
      toast.success(res.defaultMutation.message)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  });

  const handleSave = async () => {
    if (!payload.name) {
      toast.error('Name required!')
      return
    }
    let logoAttachment;
    if (logo) {
      setFileUploadLoading(true)
      const { secure_url, public_id } = await uploadFile(logo, 'logo');
      await deleteFile(clientDetails.logoFileId)
      logoAttachment = {
        logoUrl: secure_url,
        logoFileId: public_id,
      };
      setFileUploadLoading(false)
    }
    let coverAttachment;
    if (cover) {
      setFileUploadLoading(true)
      const { secure_url, public_id } = await uploadFile(cover, 'cover');
      await deleteFile(clientDetails.coverPhotoFileId)
      coverAttachment = {
        coverPhotoUrl: secure_url,
        coverPhotoFileId: public_id,
      };
      setFileUploadLoading(false)
    }
    defaultMutation({
      variables: {
        address: payload.address,
        contact: payload.contact,
        formationDate: payload.formationDate,
        name: payload.name,
        email: payload.email,
        slogan: payload.slogan,
        socialMediaLinks: JSON.stringify({
          facebook: socialPayload.facebook,
          instagram: socialPayload.instagram,
          linkedIn: socialPayload.linkedIn,
          youtube: socialPayload.youtube
        }),
        ...logoAttachment,
        ...coverAttachment
      }
    })
  }

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  }
  const handleSicialInputChange = (e) => {
    setSocialPayload({ ...socialPayload, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    fetchClientDetails()
  }, [])

  useEffect(() => {
    if (clientDetails) {
      setPayload({
        address: clientDetails?.address ?? null,
        contact: clientDetails?.contact ?? null,
        email: clientDetails?.email ?? null,
        formationDate: clientDetails?.formationDate ?? null,
        logoUrl: clientDetails?.logoUrl ?? null,
        name: clientDetails?.name ?? null,
        slogan: clientDetails?.slogan ?? null,
        coverVideoUrl: clientDetails?.coverVideoUrl ?? null,
      });
      setSocialLinkJson(JSON.parse(clientDetails.socialMediaLinks ?? '{}'))
    }
  }, [clientDetails])

  useEffect(() => {
    setSocialPayload({
      facebook: socialLinkJson?.facebook ?? '',
      instagram: socialLinkJson?.instagram ?? '',
      linkedIn: socialLinkJson?.linkedIn ?? '',
      youtube: socialLinkJson?.youtube ?? ''
    })
  }, [socialLinkJson])

  return (
    <Box sx={{ minHeight: '600px' }} maxWidth='xxl'>
      <Typography sx={{ fontSize: { xs: '18px', lg: '24px' }, fontWeight: 600, mb: 6 }}>Update Company Info </Typography>
      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Box />
        {
          editOn ?
            <Stack direction='row' gap={2} alignItems='center'>
              <CButton onClick={() => setEditOn(false)} variant='outlined'>Cancel</CButton>
              <CButton isLoading={fileUploadLoading} onClick={handleSave} variant='contained'>Update</CButton>
            </Stack>
            : <Button onClick={() => setEditOn(true)} variant='contained'>Edit Info</Button>
        }
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 6 }}>
        <Stack sx={{ flex: 1 }} gap={2}>
          <TextField disabled={!editOn} value={payload.name} onChange={handleInputChange} name='name' size='small' fullWidth label='Name' />
          <TextField disabled={!editOn} value={payload.email} onChange={handleInputChange} name='email' size='small' fullWidth label='Email' />
          <TextField disabled={!editOn} value={payload.contact} onChange={handleInputChange} name='contact' size='small' fullWidth label='Contact' />
          {/* <TextField disabled={!editOn} value={payload.formationDate} onChange={handleInputChange} name='formationDate' size='small' type='date' helperText='Formation Date' fullWidth label='' /> */}
          <TextField disabled={!editOn} value={payload.address} onChange={handleInputChange} name='address' size='small' fullWidth label='Address' />
          <TextField disabled={!editOn} value={payload.slogan} onChange={handleInputChange} name='slogan' size='small' fullWidth label='Slogan' />
          <TextField disabled={!editOn} value={payload.coverVideoUrl} onChange={handleInputChange} name='coverVideoUrl' size='small' fullWidth label='Video Url' placeholder='Ex: https://www.youtube.com/watch?v=M93NSz5bcIk' />
        </Stack>
        <Stack sx={{ flex: 1 }} gap={2}>
          <TextField disabled={!editOn} placeholder='https://example.com' value={socialPayload.facebook} onChange={handleSicialInputChange} name='facebook' size='small' fullWidth label='Facebook' />
          <TextField disabled={!editOn} placeholder='https://example.com' value={socialPayload.instagram} onChange={handleSicialInputChange} name='instagram' size='small' fullWidth label='Instagram' />
          <TextField disabled={!editOn} placeholder='https://example.com' value={socialPayload.linkedIn} onChange={handleSicialInputChange} name='linkedIn' size='small' fullWidth label='LinkedIn' />
          <TextField disabled={!editOn} placeholder='https://example.com' value={socialPayload.youtube} onChange={handleSicialInputChange} name='youtube' size='small' fullWidth label='Youtube' />
          <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
            {
              (logo || clientDetails?.logoUrl) && <Box sx={{
                flex: 1
              }}>
                <Box sx={{
                  width: '100%',
                  height: '114px'
                }}>
                  <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    src={logo ? URL.createObjectURL(logo) : clientDetails?.logoUrl} alt=""
                  />
                </Box>
              </Box>
            }
            <Box sx={{
              flex: 1
            }}>
              <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
                <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Company Logo (jpg,png,gif)</Typography>
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  disabled={!editOn}
                  startIcon={<CloudUpload />}
                >
                  Upload file
                  <input onChange={(e) => {
                    const file = e.target.files[0];
                    const maxFileSize = 500 * 1024; // 500KB in bytes
                    // if (file.size > maxFileSize) {
                    //   alert(`File ${file.name} is too large. Please select a file smaller than 500KB.`);
                    //   return
                    // }
                    setLogo(e.target.files[0])
                  }} type="file" hidden />
                  {/* <VisuallyHiddenInput type="file" /> */}
                </Button>
              </Stack>
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
            {
              (cover || clientDetails?.coverPhotoUrl) && <Box sx={{
                flex: 1
              }}>
                <Box sx={{
                  width: '100%',
                  height: '114px'
                }}>
                  <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    src={cover ? URL.createObjectURL(cover) : clientDetails?.coverPhotoUrl} alt="" />
                </Box>
              </Box>
            }
            <Box sx={{
              flex: 1
            }}>
              <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
                <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Hero Background (jpg,png) (Max 500KB)</Typography>
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  disabled={!editOn}
                  startIcon={<CloudUpload />}
                >
                  Upload file
                  <input onChange={(e) => {
                    const file = e.target.files[0];
                    const maxFileSize = 500 * 1024; // 500KB in bytes
                    if (file.size > maxFileSize) {
                      alert(`File ${file.name} is too large. Please select a file smaller than 500KB.`);
                      return
                    }
                    setCover(e.target.files[0])
                  }} type="file" hidden />
                  {/* <VisuallyHiddenInput type="file" /> */}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Info