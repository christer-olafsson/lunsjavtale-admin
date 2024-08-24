const CourseCard = () => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' gap={{ xs: 1, sm: 2, md: 4 }} sx={{
      // maxWidth: '1000px',
      border: '1px solid lightgray',
      width: '100%',
      bgcolor: '#fff',
      p: 2, borderRadius: '8px',
      position: 'relative',
      boxShadow: 1
    }}>
      <Box sx={{ width: { xs: '100%', md: '300px' }, height: '220px' }}>
        <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} src="/course-01.jpg" alt="" />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ fontSize: '20px', lineHeight: '25px', fontWeight: '600', my: { xs: 1, md: 2 } }}>Wordpress Advance to Marketplace</Typography>
        <Stack sx={{maxWidth:'600px'}} direction='row' flexWrap='wrap' gap={1} mb={1}>
          {
            [
              '25 Live Class',
              '15+ Website',
              'Own Softwere',
              'Course Certificate',
              'Re-Admission',
              'Support Instructor'
            ].map(item => (
              <Typography sx={{
                border: '1px solid lightgray',
                px: 1.5, borderRadius: '8px',
                whiteSpace: 'nowrap'
              }} variant='body2' key={item}>{item}</Typography>
            ))
          }
        </Stack>
        <Typography sx={{ mb: 1 }}>Course Fee: <span style={{ color: 'green', }}>$40</span></Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack direction='row' gap={1}>
            <Avatar />
            <Box>
              <Typography sx={{ whiteSpace: 'nowrap' }}>Jesse Stevens</Typography>
              <Typography variant='body2'>Instructor</Typography>
            </Box>
          </Stack>
          <Stack sx={{ width: '100%' }} direction='row' gap={2} alignItems='center' mt={{ xs: 1, md: 0 }} justifyContent={{ xs: 'space-between', md: 'flex-end' }}>
            <Button sx={{ borderRadius: '50px' }}>Details</Button>
            <Button variant='contained' sx={{ borderRadius: '50px' }}>Enrole Now</Button>
          </Stack>
        </Stack>
      </Box>
    </Stack >
  )
}