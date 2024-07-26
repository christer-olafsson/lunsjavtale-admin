import { useLazyQuery, useQuery } from '@apollo/client'
import { Add, ArrowRightAlt, Edit, Error, Search } from '@mui/icons-material'
import { Box, Button, Divider, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputLabel, MenuItem, Pagination, Rating, Select, Stack, Switch, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GET_ALL_CATEGORY, GET_SINGLE_CATEGORY, PRODUCTS } from './graphql/query'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import CDialog from '../../common/dialog/CDialog'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import { Link } from 'react-router-dom'
import EditItem from './EditItem'
import FoodCard from './FoodCard'


const FoodCategories = () => {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [categoryId, setCategoryId] = useState(null);
  const [allCategorys, setAllCategorys] = useState([]);
  const [products, setProducts] = useState([]);
  const [editCategoryData, setEditCategoryData] = useState({})
  const [searchText, setSearchText] = useState('')
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [productsLength, setProductsLength] = useState([])
  const [vendorProductShow, setVendorProductShow] = useState(false)


  const [productEditDialogOpen, setProductEditDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const theme = useTheme();

  const [fetchCategory, { loading: loadingCategory, error: categoryErr }] = useLazyQuery(GET_ALL_CATEGORY, {
    variables: {
      isVendorProduct: vendorProductShow ? vendorProductShow : null
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setAllCategorys(data?.categories?.edges)
      // setAllCategorys(data?.categories?.edges.map(item => item).sort((a, b) => a.node.order - b.node.order))
      fetchProducts()
    },
  });

  useQuery(PRODUCTS, {
    variables: {
      isVendorProduct: vendorProductShow ? vendorProductShow : null
    },
    onCompleted: (res) => {
      const data = res.products.edges.map(item => item.node)
      setProductsLength(data.length)
    },
  });

  const [fetchProducts, { loading: loadinProducts, error: errProducts }] = useLazyQuery(PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      offset: (page - 1) * 12,
      first: 12,
      category: categoryId,
      title: searchText,
      availability: status === 'available' ? true : status === 'not-available' ? false : null,
      isVendorProduct: vendorProductShow ? vendorProductShow : null
    },
    onCompleted: (res) => {
      const data = res.products.edges.map(item => item)
      setProducts(data)
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

  useEffect(() => {
    setPage(1)
  }, [categoryId])


  return (
    <Box maxWidth='xl'>
      <Stack direction='row' justifyContent='space-between'>
        <Box />
        <Button sx={{ height: 'fit-content' }} onClick={() => setAddCategoryOpen(true)} startIcon={<Add />} variant='contained'>New Categories</Button>
      </Stack>
      <Stack direction='row' gap={2} mt={2}>
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
              {/* <MenuItem value={'vendors'}>Vendors</MenuItem> */}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <FormGroup sx={{ my: 1 }}>
        <FormControlLabel control={<Switch
          size='small'
          checked={vendorProductShow}
          onChange={e => setVendorProductShow(e.target.checked)}
        />} label="Supplier" />
      </FormGroup>
      {/* add category */}
      <CDialog openDialog={addCategoryOpen}>
        <AddCategory fetchCategory={fetchCategory} closeDialog={() => setAddCategoryOpen(false)} />
      </CDialog>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} flexWrap='wrap' mt={2}>
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
            <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{productsLength} Available products</Typography>
          </Box>
        </Stack>
        {
          // loadingCategory ? <Loader /> : categoryErr ? <ErrorMsg /> :
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
                  <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>({item?.node?.products?.edges.length}) Available products</Typography>
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
              <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>{products.length} Available products</Typography>
            }
          </Box>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} flexWrap='wrap' gap={2} mt={3}>
        {
          loadinProducts ? <Loader /> : errProducts ? <ErrorMsg /> :
            products.length === 0 ?
              <Typography sx={{ p: 5 }}>No Product Found!</Typography> :
              products.map((data, id) => (
                <FoodCard
                  key={id}
                  fetchCategory={fetchCategory}
                  fetchProducts={fetchProducts}
                  data={data}
                />
              ))
        }
        <Stack width='100%' direction='row' justifyContent='end' my={2}>
          <Pagination count={Math.ceil(categoryId !== null ? products.length / 12 : productsLength / 12)} page={page} onChange={(e, value) => setPage(value)} />
        </Stack>
      </Stack>

    </Box >
  )
}

export default FoodCategories