import { useLazyQuery, useQuery } from '@apollo/client'
import { Add, ArrowRightAlt, Edit, Error, Search } from '@mui/icons-material'
import { Box, Button, Divider, FormControl, IconButton, Input, InputLabel, MenuItem, Rating, Select, Stack, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GET_ALL_CATEGORY, GET_SINGLE_CATEGORY, PRODUCTS } from './graphql/query'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import CDialog from '../../common/dialog/CDialog'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import { Link } from 'react-router-dom'
import EditItem from './EditItem'


const FoodCategories = () => {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [categoryId, setCategoryId] = useState(null);
  const [allCategorys, setAllCategorys] = useState([]);
  const [singleCategory, setSingleCategory] = useState([]);
  const [editCategoryData, setEditCategoryData] = useState({})
  const [searchText, setSearchText] = useState('')
  const [status, setStatus] = useState('');

  const [productEditDialogOpen, setProductEditDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const theme = useTheme();

  const [fetchCategory, { loading: loadingCategory, error: categoryErr }] = useLazyQuery(GET_ALL_CATEGORY, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setAllCategorys(data?.categories?.edges)
      fetchProducts()
    },
  });

  const [fetchProducts, { loading: loadinProducts, error: errProducts }] = useLazyQuery(PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      category: categoryId,
      title: searchText,
      availability: status === 'available' ? true : status === 'not-available' ? false : null,
      isVendorProduct: status === 'vendors' ? true : null
    },
    onCompleted: (res) => {
      const data = res.products.edges.filter(item => !item.node.vendor?.isDeleted).map(item => item)
      setSingleCategory(data)
    },
  });

  const handleEdit = (item) => {
    setEditCategoryData(item);
    setCategoryId(item.node.id)
    setEditCategoryOpen(true)
  };

  const handleProductEditDialogOpen = (id) => {
    setSelectedProductId(id)
    setProductEditDialogOpen(true);
  };

  useEffect(() => {
    fetchCategory()
    fetchProducts()
  }, [])
  return (
    <Box maxWidth='xl'>
      <Stack direction='row' justifyContent='space-between'>
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
            pl: 2,
          }}>
            <Input onChange={e => setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Search' />
            <IconButton><Search /></IconButton>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <FormControl size='small' fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={e => setStatus(e.target.value)}
              >
                <MenuItem value={'all'}>All </MenuItem>
                <MenuItem value={'available'}>Available</MenuItem>
                <MenuItem value={'not-available'}>Not Available</MenuItem>
                <MenuItem value={'vendors'}>Vendors</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
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
            singleCategory.length === 0 ?
              <Typography sx={{ p: 5 }}>No Product Found!</Typography> :
              singleCategory.map((data, id) => (
                <Box key={id} sx={{
                  width: { xs: '100%', md: '300px' },
                  boxShadow: data.node.availability ? 2 : 0,
                  p: { xs: 1, lg: 2.5 },
                  borderRadius: '8px',
                  border: data.node.vendor ? '1px solid coral' : '1px solid lightgray',
                  position: 'relative'
                }}>
                  {
                    !data.node.availability &&
                    <Error sx={{
                      position: 'absolute',
                      m: 1,
                      color: '#fff',
                      fontSize: '3rem',
                      zIndex: 2,
                    }} />
                  }
                  <img style={{
                    opacity: data.node.availability ? '1' : '.3'
                    , width: '100%', height: '138px', objectFit: 'cover', borderRadius: '4px'
                  }}
                    src={data?.node.attachments.edges.find(item => item.node.isCover)?.node.fileUrl || '/noImage.png'} alt="" />
                  <Stack>
                    {/* <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>lunch</Typography> */}
                    <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>{data?.node.name}</Typography>
                    <Stack direction='row' alignItems='center' gap={1} mt={1}>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          bgcolor: data.node.availability ? 'primary.main' : 'darkgray',
                          color: '#fff',
                          px: 1, borderRadius: '4px',
                        }}>
                        {data.node.availability ? 'Available' : 'Not Available'}
                      </Typography>
                      {
                        data.node.vendor !== null &&
                        <Typography
                          sx={{
                            fontSize: '12px',
                            bgcolor: 'coral',
                            color: '#fff',
                            px: 1, borderRadius: '4px',
                          }}>
                          Vendor
                        </Typography>
                      }
                    </Stack>
                    {
                      data.node.vendor &&
                      <Link style={{ fontSize: '14px' }} to={`/dashboard/suppliers/details/${data.node.vendor.id}`}>{data.node.vendor.name}</Link>
                    }
                    {/* <Stack direction='row' alignItems='center' gap={1}>
                      <Rating value={4} size='small' sx={{ color: 'primary.main' }} readOnly />
                      <Typography sx={{ fontSize: '12px' }}>86 Rating</Typography>
                      <span>|</span>
                      <Typography sx={{ fontSize: '12px' }}>43 Delivery</Typography>
                    </Stack> */}
                    <Stack direction='row' alignItems='center' justifyContent='space-between' gap={1}>
                      <Typography sx={{ fontSize: '16px' }}><i style={{ fontWeight: 600 }}>kr </i> {data.node.priceWithTax}
                        <i style={{ fontWeight: 400, fontSize: '13px' }}> (tax)</i> </Typography>
                      <Typography sx={{ fontSize: { xs: '14px', lg: '14px', color: '#848995' } }}><i style={{ fontWeight: 600 }}>kr </i> {data.node.actualPrice}</Typography>
                    </Stack>
                  </Stack>
                  <Stack direction='row' alignItems='center' justifyContent='space-between' mt={1}>
                    <Button variant='outlined' onClick={() => handleProductEditDialogOpen(id)} sx={{ bgcolor: '#fff', whiteSpace: 'nowrap' }}>Edit Now</Button>
                    <Link to={`/dashboard/food-categories/food-details/${data.node.id}`}>
                      <Button endIcon={<ArrowRightAlt />}>Details</Button>
                    </Link>
                  </Stack>
                  {/* product edit dialog */}
                  {
                    selectedProductId === id && (
                      <CDialog openDialog={productEditDialogOpen}>
                        <EditItem fetchCategory={fetchCategory} data={data.node} closeDialog={() => setProductEditDialogOpen(false)} />
                      </CDialog>
                    )
                  }
                </Box>
              ))
        }
      </Stack>

    </Box >
  )
}

export default FoodCategories