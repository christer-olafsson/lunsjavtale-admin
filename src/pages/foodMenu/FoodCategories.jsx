import { useQuery } from '@apollo/client'
import { Add } from '@mui/icons-material'
import { Box, Button, Divider, Rating, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { GET_ALL_CATEGORY, GET_SINGLE_CATEGORY } from './graphql/query'
import Loader from '../../common/loader/Index'
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg'
import CDialog from '../../common/dialog/CDialog'
import AddCategory from './AddCategory'

const categorydata = [
  {
    icon: '/Breakfast.png',
    name: 'Breakfast',
    available: '999 Available products'
  },
  {
    icon: '/Dinner.png',
    name: 'Dinner',
    available: '999 Available products'
  },
  {
    icon: '/Lunch.png',
    name: 'Lunch',
    available: '999 Available products'
  },
  {
    icon: '/Option.png',
    name: 'Option',
    available: '999 Available products'
  },
  {
    icon: '/All.png',
    name: 'All',
    available: '999 Available products'
  },
]

const FoodCategories = () => {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [categoryId, setCategoryId] = useState(1);
  const [allCategorys, setAllCategorys] = useState([]);
  const [singleCategory, setSingleCategory] = useState([])

  const { loading: loadingCategory, error: categoryErr } = useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      const res = data?.categories?.edges
      setAllCategorys(res)
    },
  });

  console.log(singleCategory)
  const { loading: loadinSingleCat, error: errSingleCat } = useQuery(GET_SINGLE_CATEGORY, {
    variables: {
      id: categoryId
    },
    onCompleted: (res) => {
      const data = res.category.products.edges
      setSingleCategory(data)
    },
  });

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between'>
        <Box />
        <Button onClick={()=> setAddCategoryOpen(true)} startIcon={<Add />} variant='contained'>New Categories</Button>
      </Stack>
      <CDialog openDialog={addCategoryOpen}>
          <AddCategory closeDialog={() => setAddCategoryOpen(false)} />
        </CDialog>
      <Stack direction='row' gap={2} flexWrap='wrap' mt={4}>
        {
          loadingCategory ? <Loader /> : categoryErr ? <ErrorMsg /> :
            allCategorys.map(item => (
              <Stack onClick={() => setCategoryId(item.node.id)} key={item.node.id} sx={{
                bgcolor: categoryId === item.node.id ? 'primary.main' : 'light.main',
                color: categoryId === item.node.id ? '#fff' : 'inherit',
                borderRadius: '8px',
                padding: '20px 35px',
                width:{xs:'100%',lg:'300px'},
                cursor: 'pointer'
              }} direction='row' gap={2} alignItems='center'>
                <img src='/Breakfast.png' alt="" />
                <Divider orientation="vertical" />
                <Box>
                  <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>{item.node.name}</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>999 Available products</Typography>
                </Box>
              </Stack>
            ))
        }
      </Stack>

      <Stack direction={{xs:'column',lg:'row'}} gap={2} mt={3}>
        {
          loadinSingleCat ? <Loader /> : errSingleCat ? <ErrorMsg /> :
            singleCategory.map(item => (
              <Box key={item.node.id} sx={{
                bgcolor: 'light.main',
                p: 2, borderRadius: '8px',
                width: {xs:'100%',lg:'235px'}
              }}>
                <img style={{ width: '100%', height: '138px', borderRadius: '8px', objectFit: 'cover' }} 
                src={item.node.attachments.edges[0].node.fileUrl} alt="" />
                <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{item.node.category.name}</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{item.node.name}</Typography>
                <Stack direction='row' gap={1} alignItems='center'>
                  <Rating sx={{ color: 'primary.main', fontSize: '12px' }} value={4} readOnly />
                  <Typography sx={{ fontSize: '12px', fontWeight: 400 }}>17 Rating</Typography>
                  <span>|</span>
                  <Typography sx={{ fontSize: '12px', fontWeight: 400 }}>27 Delivery</Typography>
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between' mt={1}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>$200.00</Typography>
                  {/* <Button size='small' variant='outlin ed' sx={{ bgcolor: '#fff' }}>Edit Now</Button> */}
                </Stack>
              </Box>
            ))
        }
      </Stack>

    </Box>
  )
}

export default FoodCategories