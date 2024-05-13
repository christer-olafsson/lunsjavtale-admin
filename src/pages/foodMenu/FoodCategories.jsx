import { useLazyQuery, useQuery } from '@apollo/client'
import { Add, Edit } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Rating, Stack, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GET_ALL_CATEGORY, GET_SINGLE_CATEGORY, GET_SINGLE_PRODUCTS } from './graphql/query'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import CDialog from '../../common/dialog/CDialog'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'


const FoodCategories = () => {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [categoryId, setCategoryId] = useState(null);
  const [allCategorys, setAllCategorys] = useState([]);
  const [singleCategory, setSingleCategory] = useState([]);
  const [editCategoryData, setEditCategoryData] = useState({})

  const theme = useTheme();

  const [fetchCategory, { loading: loadingCategory, error: categoryErr }] = useLazyQuery(GET_ALL_CATEGORY, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setAllCategorys(data?.categories?.edges)
    },
  });

  const { loading: loadinProducts, error: errProducts } = useQuery(GET_SINGLE_PRODUCTS, {
    variables: {
      category: categoryId
    },
    onCompleted: (res) => {
      const data = res.products.edges
      setSingleCategory(data)
    },
  });

  const handleEdit = (item) => {
    setEditCategoryData(item);
    setCategoryId(item.node.id)
    setEditCategoryOpen(true)
  };

  useEffect(() => {
    fetchCategory()
  }, [])
  return (
    <Box>
      <Stack direction='row' justifyContent='space-between'>
        <Box />
        <Button onClick={() => setAddCategoryOpen(true)} startIcon={<Add />} variant='contained'>New Categories</Button>
      </Stack>
      {/* add category */}
      <CDialog openDialog={addCategoryOpen}>
        <AddCategory fetchCategory={fetchCategory} closeDialog={() => setAddCategoryOpen(false)} />
      </CDialog>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} flexWrap='wrap' mt={4}>
        <Stack onClick={() => setCategoryId(null)} sx={{
          bgcolor: categoryId === null ? 'primary.main' : 'light.main',
          color: categoryId === null ? '#fff' : 'inherit',
          borderRadius: '8px',
          padding: 2,
          height: '90px',
          width: { xs: '100%', md: '300px' },
          cursor: 'pointer',
          border: `1px solid ${theme.palette.primary.main}`
        }} direction='row' gap={2} alignItems='center'>
          <img style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover'
          }} src='/Breakfast.png' alt="" />
          <Divider orientation="vertical" />
          <Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>All Products</Typography>
            {
              categoryId === null &&
              <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{singleCategory.length} Available products</Typography>
            }
          </Box>
        </Stack>
        {
          loadingCategory ? <Loader /> : categoryErr ? <ErrorMsg /> :
            allCategorys?.map(item => (
              <Box sx={{
                position: 'relative'
              }} key={item?.node.id}>
                <Stack onClick={() => setCategoryId(item?.node.id)} sx={{
                  bgcolor: categoryId === item.node.id ? 'primary.main' : 'light.main',
                  color: categoryId === item.node.id ? '#fff' : !item.node.isActive ? '#AEAEAE' : 'inherit',
                  borderRadius: '8px',
                  padding: 2,
                  height: '90px',
                  width: { xs: '100%', md: '300px' },
                  cursor: 'pointer',
                  border: item.node.isActive ? `1px solid ${theme.palette.primary.main}` : ''
                }} direction='row' gap={2} alignItems='center'>
                  <img style={{
                    opacity: !item.node.isActive ? '.4' : '.8',
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover'
                  }} src={item.node.logoUrl ? item.node?.logoUrl : '/Breakfast.png'} alt="" />
                  <Divider orientation="vertical" />
                  <Box>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{item?.node?.isActive ? 'Active' : 'Inactive'}</Typography>
                    <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>{item?.node?.name}</Typography>
                    {
                      categoryId === item?.node.id &&
                      <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{singleCategory.length} Available products</Typography>
                    }
                  </Box>
                </Stack>
                <IconButton onClick={() => handleEdit(item)} sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0
                }}>
                  <Edit fontSize='small' />
                </IconButton>
                {/* edit category */}
                {
                  categoryId === item?.node?.id &&
                  <CDialog openDialog={editCategoryOpen}>
                    <EditCategory fetchCategory={fetchCategory} data={editCategoryData} closeDialog={() => setEditCategoryOpen(false)} />
                  </CDialog>
                }
              </Box>
            ))
        }
        <Stack onClick={() => setCategoryId("0")} sx={{
          bgcolor: categoryId === "0" ? 'primary.main' : 'light.main',
          color: categoryId === "0" ? '#fff' : 'inherit',
          borderRadius: '8px',
          padding: 2,
          height: '90px',
          width: { xs: '100%', md: '300px' },
          cursor: 'pointer',
          // border: `1px solid ${theme.palette.primary.main}`
        }} direction='row' gap={2} alignItems='center'>
          <img style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover'
          }} src='/Breakfast.png' alt="" />
          <Divider orientation="vertical" />
          <Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>Uncategorised</Typography>
            {
              categoryId === '0' &&
              <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{singleCategory.length} Available products</Typography>
            }
          </Box>
        </Stack>

      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} flexWrap='wrap' gap={2} mt={3}>
        {
          loadinProducts ? <Loader /> : errProducts ? <ErrorMsg /> :
            singleCategory.map(item => (
              <Box key={item.node.id} sx={{
                bgcolor: 'light.main',
                p: 2, borderRadius: '8px',
                width: { xs: '100%', md: '235px' }
              }}>
                <img style={{ width: '100%', height: '138px', borderRadius: '8px', objectFit: 'cover' }}
                  src={item.node.attachments.edges[0] ? item.node.attachments.edges[0].node.fileUrl : ''} alt="" />
                <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{item.node.category?.name ? item.node.category?.name : 'Uncategorised'}</Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>{item.node.name}</Typography>
                <Stack direction='row' gap={1} alignItems='center'>
                  <Rating sx={{ color: 'primary.main', fontSize: '12px' }} value={4} readOnly />
                  <Typography sx={{ fontSize: '12px', fontWeight: 400 }}>17 Rating</Typography>
                  <span>|</span>
                  <Typography sx={{ fontSize: '12px', fontWeight: 400 }}>27 Delivery</Typography>
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between' mt={1}>
                  <Typography sx={{ fontSize: '16px' }}>${item.node.priceWithTax}
                    <i style={{ fontWeight: 400, fontSize: '16px' }}> (Tax)</i> </Typography>
                  <Typography sx={{ fontSize: { xs: '14px', lg: '16px', color: '#848995' } }}>${item.node.actualPrice}</Typography>
                  {/* <Button size='small' variant='outlin ed' sx={{ bgcolor: '#fff' }}>Edit Now</Button> */}
                </Stack>
              </Box>
            ))
        }
      </Stack>

    </Box >
  )
}

export default FoodCategories