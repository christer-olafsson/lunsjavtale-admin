import { Add, ArrowRightAlt, Bookmark, BookmarkBorder, ChevronRight, Error, ErrorOutline, Search } from '@mui/icons-material';
import { Autocomplete, Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputLabel, MenuItem, Pagination, Select, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import CDialog from '../../common/dialog/CDialog';
import AddItem from './AddItem';
import EditItem from './EditItem';
import { Link } from 'react-router-dom';
import { GET_ALL_CATEGORY, PRODUCTS } from './graphql/query';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import toast from 'react-hot-toast';
import { FAVORITE_PRODUCT_MUTATION } from './graphql/mutation';
import { VENDORS } from '../suppliers/graphql/query';
import SlideDrawer from './SlideDrawer';
import FoodDetails from './FoodDetails';
import FoodCard from './FoodCard';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


const FoodItem = () => {
  const [productAddDialogOpen, setAddItemDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [allCategorys, setAllCategorys] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('')
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [productsLength, setProductsLength] = useState([])
  const [vendorProductShow, setVendorProductShow] = useState(false)
  const [vendors, setVendors] = useState([])
  const [selectedVendor, setSelectedVendor] = useState([])
  const [foodDetailsData, setFoodDetailsData] = useState({})


  const { loading: vendorLoading } = useQuery(VENDORS, {
    variables: {
      hasProduct: true
    },
    onCompleted: (res) => {
      const data = res.vendors.edges.filter(item => !item.node.isDeleted).map(item => item.node)
      setVendors(data)
    }
  })


  const [fetchCategory] = useLazyQuery(GET_ALL_CATEGORY, {
    variables: {
      vendor: selectedVendor ? selectedVendor.id : null,
      isVendorProduct: vendorProductShow ? vendorProductShow : null,
      availability: status === 'available' ? true : status === 'not-available' ? false : null,
      isFeatured: status === 'featured' ? true : null
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setAllCategorys(data?.categories?.edges)
      fetchProducts()
    },
  });

  useQuery(PRODUCTS, {
    variables: {
      vendor: selectedVendor ? selectedVendor.id : null,
      isVendorProduct: vendorProductShow ? vendorProductShow : null,
      availability: status === 'available' ? true : status === 'not-available' ? false : null,
      isFeatured: status === 'featured' ? true : null
    },
    onCompleted: (res) => {
      const data = res.products.edges.map(item => item.node)
      setProductsLength(data.length)
    },
  });


  const [fetchProducts, { loading: loadingProducts, error: errProducts }] = useLazyQuery(PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      offset: (page - 1) * 12,
      first: 12,
      category: categoryId,
      title: searchText,
      isFeatured: status === 'featured' ? true : null,
      availability: status === 'available' ? true : status === 'not-available' ? false : null,
      isVendorProduct: vendorProductShow ? vendorProductShow : null,
      vendor: selectedVendor ? selectedVendor.id : null,
    },
    onCompleted: (res) => {
      const data = res.products.edges.map(item => item)
      setProducts(data)
    },
  });

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
  }, [categoryId, status])

  return (
    <Box maxWidth='xl'>
      <Stack direction={{ xs: 'column-reverse', md: 'row' }} justifyContent='space-between' mb={2} gap={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
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
                <MenuItem value={'featured'}>Featured</MenuItem>
                <MenuItem value={'available'}>Available</MenuItem>
                <MenuItem value={'not-available'}>Not Available</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* all vendors */}
          <Autocomplete
            sx={{ minWidth: '300px' }}
            size='small'
            loading={vendorLoading}
            options={vendors}
            onChange={(_, value) => setSelectedVendor(value)}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Stack direction='row' alignItems='center'>
                  <IconButton>
                    <Link to={`/dashboard/suppliers/details/${option.id}`}>
                      <ChevronRight fontSize='small' />
                    </Link>
                  </IconButton>
                  <Stack direction='row' alignItems='center' gap={1}>
                    <Avatar src={option.logoUrl ?? ''} />
                    <Box>
                      <Typography>{option.name}</Typography>
                      <Typography sx={{ fontSize: '12px' }}>{option.email}</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Select Supplier" />
            )}
          />
          <FormGroup sx={{ my: 1 }}>
            <FormControlLabel control={<Switch
              size='small'
              checked={vendorProductShow}
              onChange={e => setVendorProductShow(e.target.checked)}
            />} label="Supplier" />
          </FormGroup>
        </Stack>
        <Button onClick={() => setAddItemDialogOpen(true)} sx={{ whiteSpace: 'nowrap', width: '150px' }} variant='contained' startIcon={<Add />}>Add Items</Button>
      </Stack>
      {/* product add dialog */}
      {
        <CDialog openDialog={productAddDialogOpen}>
          <AddItem fetchCategory={fetchCategory} closeDialog={() => setAddItemDialogOpen(false)} />
        </CDialog>
      }
      <Stack direction='row' gap={2} flexWrap='wrap' mt={4}>
        <Box sx={{
          border: '1px solid lightgray',
          py: 1, px: 2,
          borderRadius: '8px',
          bgcolor: categoryId === null ? 'primary.main' : 'inherit',
          color: categoryId === null ? '#fff' : 'inherit',
          cursor: 'pointer',
          userSelect: 'none'
        }} onClick={() => setCategoryId(null)}>
          <Typography>All {<i style={{ fontSize: '14px', fontWeight: 600, marginLeft: '5px' }}>({productsLength})</i>}</Typography>
        </Box>
        {
          // loadingCategory ? <LoadingBar/> : 
          allCategorys?.map((item) => (
            <Box sx={{
              border: '1px solid lightgray',
              py: 1, px: 2,
              borderRadius: '8px',
              bgcolor: categoryId === item.node.id ? 'primary.main' : 'inherit',
              color: categoryId === item.node.id ? '#fff' : 'inherit',
              cursor: 'pointer',
              userSelect: 'none',
              opacity: !item.node.isActive ? '.4' : '1'
            }} onClick={() => setCategoryId(item.node.id)} key={item?.node.id}>
              <Typography>{item?.node.name}
                <i style={{ fontSize: '14px', fontWeight: 600, marginLeft: '5px' }}>({item?.node?.products?.edges.length})</i>
              </Typography>
            </Box>
          ))
        }
        <Box sx={{
          border: '1px solid lightgray',
          py: 1, px: 2,
          borderRadius: '8px',
          bgcolor: categoryId === '0' ? 'primary.main' : 'inherit',
          color: categoryId === '0' ? '#fff' : 'inherit',
          cursor: 'pointer',
          userSelect: 'none'
        }} onClick={() => setCategoryId('0')}>
          <Typography>Uncategorised</Typography>
        </Box>
      </Stack>

      {/* food card */}
      <Stack direction='row' flexWrap='wrap' gap={2} mt={2}>
        {
          loadingProducts ? <Loader /> : errProducts ? <ErrorMsg /> :
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
    </Box>
  )
}

export default FoodItem