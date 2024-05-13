/* eslint-disable react/prop-types */
import { useMutation, useQuery } from '@apollo/client';
import { Add, ArrowDropDown, Close, CloudUpload } from '@mui/icons-material'
import { Box, Button, Collapse, FormControl, FormControlLabel, FormGroup, FormHelperText, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { GET_ALL_CATEGORY } from './graphql/query';
import CButton from '../../common/CButton/CButton';
import { GET_INGREDIENTS } from '../../graphql/query';
import Loader from '../../common/loader/Index';
import ErrorMsg from '../../common/ErrorMsg/ErrorMsg';
import toast from 'react-hot-toast';
import { uploadMultiFile } from '../../utils/uploadFile';
import { PRODUCT_DELETE, PRODUCT_MUTATION } from './graphql/mutation';
import { deleteFile, deleteMultiFile } from '../../utils/deleteFile';


const EditItem = ({ data, fetchCategory, closeDialog }) => {
  const [categoryId, setCategoryId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAllergies, setAllAllergies] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [priceWithTax, setPriceWithTax] = useState("");
  const [priceWithoutTax, setPriceWithoutTax] = useState("");
  const [addAllergyInputOpen, setAddAllergyInputOpen] = useState(false);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [newAllergies, setNewAllergies] = useState([]);
  const [selectedNewAllergies, setSelectedNewAllergies] = useState([])
  const [selectAllergySecOpen, setSelectAllergySecOpen] = useState(false);
  const [imgUploadLoading, setImgUploadLoading] = useState(false);
  const [productImgFromData, setProductImgFromData] = useState([]);
  const [deletedImgId, setDeletedImgId] = useState([]);
  const [productDeleteSecOpen, setProductDeleteSecOpen] = useState(false)
  const [inputerr, setInputerr] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
  })
  // const [taxRate, setTaxRate] = useState(0.15); // Default tax rate of 15%
  const [payload, setPayload] = useState({
    name: '',
    title: '',
    description: '',
    contains: '',
    availability: true,
    discountAvailability: false
  })

  const handlePriceWithTaxChange = (event) => {
    const inputPrice = parseFloat(event.target.value);
    const taxRate = 0.15; // 15% tax rate
    const taxAmount = inputPrice * taxRate;
    const priceWithoutTax = inputPrice - taxAmount;
    setPriceWithTax(inputPrice)
    setPriceWithoutTax(priceWithoutTax)
  };
  const handlePriceWithoutTaxChange = (event) => {
    const inputPrice = parseFloat(event.target.value);
    const taxRate = 0.15; // 15% tax rate
    const taxAmount = inputPrice * taxRate;
    const priceWithTax = inputPrice + taxAmount;
    setPriceWithTax(priceWithTax)
    setPriceWithoutTax(inputPrice)
  };
  // const handleTaxRateChange = (event) => {
  //   const newTaxRate = parseFloat(event.target.value);
  //   setTaxRate(newTaxRate);
  // };

  const handleInputChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value })
  };

  // added mutiple image
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files).slice(0, 5);
    setSelectedFiles(files);
  };
  const handleFileDeselect = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };


  // product create update
  const [productMutation, { loading: productMutationLoading }] = useMutation(PRODUCT_MUTATION, {
    onCompleted: (res) => {
      fetchCategory()
      toast.success(res.productMutation.message)
      closeDialog()
    },
    onError: (err) => {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphqlError = err.graphQLErrors[0];
        const { extensions } = graphqlError;
        if (extensions && extensions.errors) {
          // setErrors(extensions.errors)
          setErrors(Object.values(extensions.errors));
        }
      }
    }
  });

  // product delete
  const [productDelete, { loading: productDeleteLoading }] = useMutation(PRODUCT_DELETE, {
    onCompleted: (res) => {
      console.log(res)
      toast.success(res.productDelete.message);
      fetchCategory()
      closeDialog()
    }
  })

  //get all allergies
  const { error: ingredientErr, loading: ingredientLoading } = useQuery(GET_INGREDIENTS, {
    onCompleted: (res) => {
      const allergiesName = res.ingredients.edges.map(item => item.node.name)
      setAllAllergies(allergiesName)
    }
  });

  //previus allargy list select or deselect
  const toggleAllergy = (allergy) => {
    const isSelected = selectedAllergies.includes(allergy);
    if (isSelected) {
      setSelectedAllergies(selectedAllergies.filter(item => item !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  //new added allargy list select or deselect
  const toggleNewAllergy = (allergy) => {
    const isSelected = selectedNewAllergies.includes(allergy);
    if (isSelected) {
      setSelectedNewAllergies(selectedNewAllergies.filter(item => item !== allergy));
    } else {
      setSelectedNewAllergies([...selectedNewAllergies, allergy]);
    }
  };
  // new allergy remove from list
  const handleNewAllergyRemove = (allergy) => {
    const filtered = newAllergies.filter(item => item !== allergy);
    setNewAllergies(filtered)
    setSelectedNewAllergies(selectedNewAllergies.filter(item => item !== allergy))
  }


  const handleProductImgRemove = (data) => {
    if (productImgFromData.length > 1) {
      const filteredData = productImgFromData.filter(item => item.fileId !== data.fileId);
      setProductImgFromData(filteredData);
    }
    setDeletedImgId([...deletedImgId, data.fileId])
  }


  const handleProductUpdate = async () => {
    if (!payload.name) {
      setInputerr({ name: "Product name required!" });
      return;
    }
    if (!categoryId) {
      setInputerr({ category: "Category required!" });
      return;
    }
    if (!priceWithTax) {
      setInputerr({ price: "Product Price required!" });
      return;
    }
    if (!payload.description) {
      setInputerr({ description: "Product description required!" });
      return;
    }
    if (deletedImgId) {
      setImgUploadLoading(true)
      await deleteMultiFile(deletedImgId);
      setImgUploadLoading(false)
    }
    let attachments = [];
    if (selectedFiles) {
      setImgUploadLoading(true)
      const res = await uploadMultiFile(selectedFiles, 'products');
      attachments = res.map(item => ({
        fileUrl: item.secure_url,
        fileId: item.public_id,
        isCover: false
      }));
      setImgUploadLoading(false)
    }
    if (data.id) {
      productMutation({
        variables: {
          input: {
            id: data.id,
            ...payload,
            contains: JSON.stringify(payload.contains),
            taxPercent: 15,
            priceWithTax,
            category: categoryId,
          },
          ingredients: [...selectedAllergies, ...selectedNewAllergies],
          attachments: [...productImgFromData, ...attachments]
        }
      })
    }
  }


  const handleProductDelete = async () => {
    const fileIds = data.attachments.edges.map(item => item.node.fileId);
    await deleteMultiFile(fileIds)
    productDelete({
      variables: {
        id: data.id
      }
    })
  }

  useQuery(GET_ALL_CATEGORY, {
    onCompleted: (data) => {
      setAllCategories(data?.categories?.edges)
    },
  });


  useEffect(() => {
    setPayload({
      name: data.name,
      title: data.title,
      description: data.description,
      contains: JSON.parse(data.contains),
      availability: data.availability,
      discountAvailability: data.discountAvailability
    })
    setPriceWithTax(data.priceWithTax);
    setPriceWithoutTax(data.actualPrice);
    setCategoryId(data?.category?.id);
    setSelectedAllergies(data?.ingredients.edges.map(item => item.node.name));
    setProductImgFromData(data.attachments.edges.map(item => ({
      fileUrl: item.node.fileUrl,
      fileId: item.node.fileId,
      isCover: item.node.isCover
    })));
  }, [])

console.log(data)
  return (
    <Box sx={{ p: { xs: 0, md: 2 } }}>
      <Stack direction='row' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Add New Items</Typography>
        <IconButton onClick={closeDialog}>
          <Close />
        </IconButton>
      </Stack>

      <Stack>
        <TextField
          error={Boolean(inputerr.name)}
          helperText={inputerr.name}
          name='name'
          value={payload.name}
          onChange={handleInputChange}
          label='Product Name'
        />
        <Stack direction='row' gap={2} mb={2} mt={2}>
          <Stack flex={1} gap={2}>
            <FormControl error={Boolean(inputerr.category)} >
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {allCategories?.map(item => (
                  <MenuItem key={item.node.id} value={item.node.id}>{item.node.name}</MenuItem>
                ))}
              </Select>
              {inputerr.category && <FormHelperText>{inputerr.category}</FormHelperText>}
            </FormControl>
            <TextField
              error={Boolean(inputerr.price)}
              type="number"
              value={priceWithTax}
              onChange={handlePriceWithTaxChange}
              label='Price (incl. Tax)'
              helperText='Including Tax (15%)'
            />
          </Stack>
          <Stack flex={1} gap={2}>
            <TextField
              name='title'
              value={payload.title}
              onChange={handleInputChange}
              label='Title'
              placeholder='E.g: Todays..'
            />
            <TextField
              type="number"
              value={priceWithoutTax}
              onChange={handlePriceWithoutTaxChange}
              label='Price (excl. Tax)'
              helperText='Without Tax (0%)'
            />
          </Stack>
        </Stack>
        <TextField
          name='contains'
          value={payload.contains}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          label='Contains'
          placeholder='E.g: 570 Calories, 40g carbohydrate..'
          rows={2}
          multiline
        />
        <TextField
          error={Boolean(inputerr.description)}
          helperText={inputerr.description}
          name='description'
          value={payload.description}
          onChange={handleInputChange}
          label='Description'
          placeholder='Products details'
          rows={4}
          multiline
        />
        <Stack direction='row' gap={2} mt={2} alignItems='center'>
          <FormControlLabel
            sx={{ mb: 1, width: 'fit-content' }}
            control={<Switch checked={payload.availability}
              onChange={e => setPayload({ ...payload, availability: e.target.checked })} />}
            label="Status Available" />
          <FormControlLabel
            control={<Switch color="warning"
              checked={payload.discountAvailability}
              onChange={e => setPayload({ ...payload, discountAvailability: e.target.checked })} />}
            label="Discount Active" />
        </Stack>


        <Box >
          <Stack direction='row' justifyContent='space-between'>
            <Box />
            <Button onClick={() => setSelectAllergySecOpen(!selectAllergySecOpen)} variant='outlined' endIcon={<ArrowDropDown />}>Select Allergies</Button>
          </Stack>
          <Collapse in={selectAllergySecOpen}>
            <Stack direction='row' flexWrap='wrap' mt={2}>
              {ingredientLoading ? <Loader /> : ingredientErr ? <ErrorMsg /> : allAllergies.map((allergy, index) => (
                <Box
                  key={index}
                  onClick={() => toggleAllergy(allergy)}
                  sx={{
                    padding: { xs: '3px 5px', md: '6px 10px' },
                    margin: '5px',
                    cursor: 'pointer',
                    border: `1px solid gray`,
                    borderRadius: '8px',
                    color: selectedAllergies.includes(allergy) ? '#fff' : 'inherit',
                    bgcolor: selectedAllergies.includes(allergy) ? 'primary.main' : 'transparent',
                    userSelect: 'none',
                    position: 'relative'
                  }}
                >
                  <Typography sx={{ fontSize: { xs: '14px', md: '16px' } }}>{allergy}</Typography>
                </Box>
              ))}
              {
                newAllergies.map((allergy => (
                  <Box sx={{
                    position: 'relative',
                    userSelect: 'none',
                  }} key={allergy}>
                    <Box
                      onClick={() => toggleNewAllergy(allergy)}
                      sx={{
                        padding: { xs: '3px 5px', md: '6px 10px' },
                        margin: '5px',
                        cursor: 'pointer',
                        border: `1px solid gray`,
                        borderRadius: '8px',
                        color: selectedNewAllergies.includes(allergy) ? '#fff' : 'inherit',
                        bgcolor: selectedNewAllergies.includes(allergy) ? 'primary.main' : 'transparent',
                      }}
                    >
                      <Typography sx={{ fontSize: { xs: '14px', md: '16px' } }}>{allergy}</Typography>
                    </Box>
                    <IconButton onClick={() => handleNewAllergyRemove(allergy)} color='primary' sx={{
                      width: '20px',
                      height: '20px',
                      position: 'absolute',
                      top: '-2px', right: '-2px',
                      border: 'none',
                      bgcolor: 'light.main',
                      ":hover": {
                        bgcolor: 'light.main'
                      }
                    }}>
                      <Close fontSize='small' />
                    </IconButton>
                  </Box>
                )))
              }
              <IconButton onClick={() => setAddAllergyInputOpen(true)}>
                <Add />
              </IconButton>
            </Stack>
            <Collapse in={addAllergyInputOpen}>
              <Paper elevation={4} sx={{
                mt: 2,
                p: 2
              }}>
                <TextField value={newAllergyInput} onChange={(e) => setNewAllergyInput(e.target.value)} size='small' label='New Allergy Name' />
                <Stack direction='row' justifyContent='space-between'>
                  <Box />
                  <Stack direction='row' gap={2}>
                    <Button onClick={() => setAddAllergyInputOpen(false)}>Cencel</Button>
                    <Button onClick={() => (
                      setNewAllergies([...newAllergies, newAllergyInput]),
                      setAddAllergyInputOpen(false),
                      setNewAllergyInput('')
                    )}>Add</Button>
                  </Stack>
                </Stack>
              </Paper>
            </Collapse>
          </Collapse>
        </Box>

        {/* Product image from api */}
        <Stack gap={2} mt={2}>
          <Stack direction='row' gap={2} flexWrap='wrap' >
            {productImgFromData.map((data, index) => (
              <Box sx={{ position: 'relative' }} key={index}>
                <IconButton sx={{ width: '25px', height: '25px', position: 'absolute', top: -10, right: -5, bgcolor: 'light.main' }}
                  onClick={() => handleProductImgRemove(data)}>
                  <Close fontSize='small' />
                </IconButton>
                <img
                  src={data.fileUrl}
                  alt={`Image ${index}`}
                  style={{ width: "100px", height: "100px", objectFit: 'cover' }}
                />
                <p>{data.name}</p>
              </Box>
            ))}
          </Stack>
          {/* selected image from file */}
          <Stack direction='row' gap={2} flexWrap='wrap' >
            {selectedFiles.map((file, index) => (
              <Box sx={{ position: 'relative' }} key={index}>
                <IconButton sx={{ width: '25px', height: '25px', position: 'absolute', top: -10, right: -5, bgcolor: 'light.main' }} onClick={() => handleFileDeselect(index)}>
                  <Close fontSize='small' />
                </IconButton>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Image ${index}`}
                  style={{ width: "100px", height: "100px", objectFit: 'cover' }}
                />
                <p>{file.name}</p>
              </Box>
            ))}
          </Stack>
          <Box sx={{ flex: 1 }}>
            <Stack sx={{ width: '100%', p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
              <Typography sx={{ fontSize: '14px', textAlign: 'center', mb: 2 }}>Chose multiple files Max(5) (jpg,png)</Typography>
              <Button component="label" role={undefined} variant="outlined" startIcon={<CloudUpload />}>
                Upload file
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} hidden />
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Stack>

      {errors.length > 0 && (
        <ul style={{ color: 'red', fontSize: '13px', padding: '10px' }}>
          {errors.map((err, id) => (
            <li key={id}>{err}</li>
          ))}
        </ul>
      )}
      <CButton isLoading={productMutationLoading || imgUploadLoading} onClick={handleProductUpdate} variant='contained' style={{ width: '100%', mt: 2 }}>Save and Add</CButton>
      <Button onClick={() => setProductDeleteSecOpen(true)} sx={{ mt: 3 }} color='warning'>Delete this product</Button>
      <Collapse in={productDeleteSecOpen}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography>Are you want to sure remove this product?</Typography>
          <Stack direction='row' gap={2}>
            <Button disabled={productDeleteLoading} onClick={handleProductDelete} color='warning'>Confirm</Button>
            <Button onClick={() => setProductDeleteSecOpen(false)}>Cencel</Button>
          </Stack>
        </Paper>
      </Collapse>
    </Box>

  )
}

export default EditItem