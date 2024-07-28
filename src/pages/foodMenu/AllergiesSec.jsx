import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { GET_INGREDIENTS } from '../../graphql/query';
import toast from 'react-hot-toast';
import { INGREDIENT_DELETE } from './graphql/mutation';
import { Box, Button, Collapse, IconButton, Stack } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';

const AllergiesSec = ({ fetchAllergies }) => {
  const [deleteSecOpen, setDeleteSecOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [allAllergies, setAllAllergies] = useState([]);

  //get all allergies
  const [fetchAll, { loading: loadingAllergies }] = useLazyQuery(GET_INGREDIENTS, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      const allergiesName = res.ingredients.edges.map(item => item.node)
      setAllAllergies(allergiesName)
    }
  });

  const [ingredientDelete, { loading: deleteLoading }] = useMutation(INGREDIENT_DELETE, {
    onCompleted: (res) => {
      toast.success(res.ingredientDelete.message);
      fetchAllergies()
      fetchAll()
    }
  })

  const handleDelete = () => {
    ingredientDelete({
      variables: {
        id: deleteId
      }
    })
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between'>
        <Box />
        <Button color='warning' onClick={() => setDeleteSecOpen(!deleteSecOpen)} >Delete Allergies</Button>
      </Stack>
      <Collapse sx={{
        border: '1px solid coral',
        borderRadius: '4px',
        p: 1
      }} in={deleteSecOpen}>
        <Stack direction='row' gap={1} flexWrap='wrap'>
          {
            allAllergies?.map(item => (
              <Stack key={item.id}>
                <Button onClick={() => {
                  if (deleteId === null) {
                    setDeleteId(item.id)
                  } else {
                    setDeleteId(null)
                  }
                }} size='small' variant='outlined' endIcon={deleteId === item.id ?
                  <IconButton disabled={deleteLoading} onClick={handleDelete} size='small' color='warning'>
                    <Delete fontSize='small' />
                  </IconButton> :
                  <Close />}>{item.name}</Button>
                <Collapse in={deleteId === item.id}>

                </Collapse>
              </Stack>
            ))
          }
        </Stack>
      </Collapse>
    </Box>
  )
}

export default AllergiesSec