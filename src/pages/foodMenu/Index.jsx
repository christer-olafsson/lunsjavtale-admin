import { Add, ArrowRightAlt, Search } from '@mui/icons-material';
import { Box, Button, IconButton, Input, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import CDialog from '../../common/dialog/CDialog';
import AddItem from './AddItem';
import EditItem from './EditItem';
import { Link } from 'react-router-dom';
import { GET_ALL_CATEGORY, PRODUCTS } from './graphql/query';
import { useLazyQuery } from '@apollo/client';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';


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
  const [productEditDialogOpen, setProductEditDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [allCategorys, setAllCategorys] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('')


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
      title: searchText
    },
    onCompleted: (res) => {
      const data = res.products.edges
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


  return (
    <Box maxWidth='xxl'>
      <Stack direction='row' justifyContent='space-between' mb={2} gap={2}>
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
          <Input onChange={e=> setSearchText(e.target.value)} fullWidth disableUnderline placeholder='Search' />
          <IconButton><Search /></IconButton>
        </Box>
        <Button onClick={() => setAddItemDialogOpen(true)} sx={{ whiteSpace: 'nowrap', width: '150px' }} variant='contained' startIcon={<Add />}>Add Items</Button>
      </Stack>
      {/* product add dialog */}
      {
        <CDialog openDialog={productAddDialogOpen}>
          <AddItem fetchCategory={fetchCategory} closeDialog={() => setAddItemDialogOpen(false)} />
        </CDialog>
      }
      <Stack direction='row' gap={2} flexWrap='wrap' my={4}>
        <Box sx={{
          border: '1px solid lightgray',
          py: 1, px: 2,
          borderRadius: '8px',
          bgcolor: categoryId === null ? 'primary.main' : 'inherit',
          color: categoryId === null ? '#fff' : 'inherit',
          cursor: 'pointer',
          userSelect: 'none'
        }} onClick={() => setCategoryId(null)}>
          <Typography>All {categoryId === null && <i style={{ fontSize: '14px' }}>({products.length})</i>}</Typography>
        </Box>
        {
          // loadingCategory ? <LoadingBar/> : 
          categoryErr ? <ErrorMsg /> :
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
                <Typography>{item?.node.name} {categoryId === item.node.id && <i style={{ fontSize: '14px' }}>({products.length})</i>}</Typography>
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
      <Stack direction='row' flexWrap='wrap' gap={2}>
        {
          loadinProducts ? <Loader /> : errProducts ? <ErrorMsg /> :
            products.length === 0 ?
              <Typography sx={{ p: 5 }}>No Product Found!</Typography> :
              products.map((data, id) => (
                <Box key={id} sx={{
                  width: { xs: '100%', md: '300px' },
                  bgcolor: data.node.availability ? 'light.main' : '#fff',
                  p: { xs: 1, lg: 2.5 },
                  borderRadius: '8px',
                  border: '1px solid lightgray',
                  opacity: data.node.availability ? '1' : '.6'
                }}>
                  <img style={{ width: '100%', height: '138px', objectFit: 'cover', borderRadius: '4px' }}
                    src={data?.node.attachments.edges.find(item => item.node.isCover)?.node.fileUrl || '/noImage.png'} alt="" />
                  <Stack>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>{data?.node.name}</Typography>
                    <Stack direction='row' alignItems='center' gap={2}>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          bgcolor: data.node.availability ? 'primary.main' : 'darkgray',
                          color: '#fff',
                          px: 1, borderRadius: '4px',
                        }}>
                        {data.node.availability ? 'Available' : 'Not Available'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{data.node.category?.name ? data.node.category?.name : 'Uncategorised'}</Typography>
                    </Stack>
                    {/* <Stack direction='row' alignItems='center' gap={1}>
                      <Rating value={4} size='small' sx={{ color: 'primary.main' }} readOnly />
                      <Typography sx={{ fontSize: '12px' }}>86 Rating</Typography>
                      <span>|</span>
                      <Typography sx={{ fontSize: '12px' }}>43 Delivery</Typography>
                    </Stack> */}
                    <Stack direction='row' alignItems='center' justifyContent='space-between' gap={1} mt={1}>
                      <Typography sx={{ fontSize: '16px' }}><i style={{ fontWeight: 600 }}>kr </i> {data.node.priceWithTax}
                        <i style={{ fontWeight: 400, fontSize: '13px' }}> (tax)</i> </Typography>
                      <Typography sx={{ fontSize: { xs: '14px', lg: '14px', color: '#848995' } }}><i style={{ fontWeight: 600 }}>kr </i>{data.node.actualPrice} </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction='row' alignItems='center' justifyContent='space-between' mt={1}>
                    <Button variant='outlined' onClick={() => handleProductEditDialogOpen(id)} sx={{ bgcolor: '#fff', whiteSpace: 'nowrap' }}>Edit Now</Button>
                    <Link to={`/dashboard/food-item/food-details/${data.node.id}`}>
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
    </Box>
  )
}

export default FoodItem