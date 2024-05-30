/* eslint-disable react/prop-types */
import { useReducer, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom';
import { AccountCircle, Business, Description, Discount, Diversity3, History, HolidayVillage, KeyboardArrowRight, LiveHelp, Logout, LunchDining, MailOutline, MapOutlined, Notifications, NotificationsNone, People, PinDrop, Recommend, Search, Settings, SpaceDashboard, } from '@mui/icons-material';
import { Avatar, Badge, ClickAwayListener, Collapse, InputAdornment, Menu, MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import { LOGOUT } from './login/graphql/mutation';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';

const drawerWidth = 264;

const ListBtn = ({ style, text, icon, link, selected, onClick, expandIcon, expand }) => {
  return (
    <Link onClick={onClick} className='link' to={link}>
      <Box sx={{
        width: '100%',
        display: 'inline-flex',
        whiteSpace: 'nowrap',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderRadius: '4px',
        overflow: 'hidden',
        // mb: 1,
        cursor: 'pointer',
        color: selected ? 'primary.main' : 'gray',
        bgcolor: selected ? 'light.main' : '',
        ...style,
        position: 'relative',
        ":before": {
          position: 'absolute',
          display: selected ? 'block' : 'none',
          top: 0,
          left: 0,
          content: '""',
          height: '100%',
          width: '3px',
          bgcolor: 'primary.main',
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography sx={{
            color: 'gray',
            fontSize: '15px',
            fontWeight: 400, ml: 1
          }}>{text}</Typography>
        </Box>
        {expandIcon && <KeyboardArrowRight sx={{
          transition: '.3s ease',
          transform: expand ? 'rotate(90deg)' : 'rotate(0deg)'
        }} />}
      </Box>
    </Link>
  )
};

const paperProps = {
  elevation: 0,
  sx: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
};


function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUsermenuOpen] = useState(null);
  const [openEmail, setOpenEmail] = useState(false)
  const [openNotification, setOpenNotification] = useState(false);
  const [drawerItemName, setDrawerItemName] = useState('');
  const [expandFoodMenu, setExpandFoodMenu] = useState(false)

  const { pathname } = useLocation();
  const orderDetailsMatch = useMatch('/dashboard/orders/details/:id')
  const foodDetailsMatchFromItem = useMatch('/dashboard/food-item/food-details/:id')
  const foodDetailsMatchFromCategories = useMatch('/dashboard/food-categories/food-details/:id')


  const [logout, { loading }] = useMutation(LOGOUT, {
    onCompleted: (res) => {
      localStorage.clear()
      toast.success(res.message)
      window.location.href = '/login'
    },
  });

  const handleLogout = () => {
    logout()
    localStorage.clear()
    window.location.href = '/'
  }

  const open = Boolean(userMenuOpen);
  const handleUserMenuOpen = (event) => {
    setUsermenuOpen(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setUsermenuOpen(null);
  };


  const handleDrawerClose = () => {
    setDrawerOpen(true);
    setMobileOpen(false);
  };
  const handleDrawerTransitionEnd = () => {
    setDrawerOpen(false);
  };
  const handleDrawerToggle = () => {
    if (!drawerOpen) {
      setMobileOpen(!mobileOpen);
    }
  };


  const drawer = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      alignItems: 'center',
      // bgcolor: '#F1F3F6',
      // height: '100%',
    }}>
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'center', mt: 2
      }}>
        <Link to='/'>
          <Box sx={{
            width: { xs: '150px', md: '180px' },
            mb: 5
          }}>
            <img style={{ width: '100%' }} src="/Logo.svg" alt="" />
          </Box>
        </Link>
      </Toolbar>
      {/* <Divider /> */}
      {/* <Typography sx={{
        width: '80%',
        padding: '16px 12px',
        color: '#fff',
        bgcolor: 'primary.main',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 500,
        textAlign: 'center',
        m: 3
      }}>
        Deal: Lunsjavtale
      </Typography> */}
      <Stack sx={{
        width: '80%'
      }}>
        <ListBtn
          onClick={handleDrawerClose}
          link='/' icon={<SpaceDashboard fontSize='small' />} text='Dashboard'
          selected={pathname === '/'} />
        <ListBtn
          onClick={handleDrawerClose}
          link='/dashboard/areas' icon={<MapOutlined fontSize='small' />} text='Areas'
          selected={pathname === '/dashboard/areas'} />
        <ListBtn onClick={() => setExpandFoodMenu(!expandFoodMenu)}
          link='/dashboard/food-item'
          expandIcon
          expand={expandFoodMenu}
          icon={<LunchDining fontSize='small' />}
          text='Food Menu'
          selected={
            pathname === '/dashboard/food-item'
            || pathname === '/dashboard/food-categories'
            || pathname === foodDetailsMatchFromItem?.pathname
            || pathname === foodDetailsMatchFromCategories?.pathname
          }
        />
        <Collapse in={expandFoodMenu} timeout="auto" unmountOnExit>
          <Box sx={{ ml: 3, mt: 1 }}>
            <ListBtn onClick={handleDrawerClose} link='/dashboard/food-item' text='Food Item'
              selected={pathname === '/dashboard/food-item' || pathname === foodDetailsMatchFromItem?.pathname} />
            <ListBtn onClick={handleDrawerClose} link='/dashboard/food-categories' text='Food Categories'
              selected={pathname === '/dashboard/food-categories' || pathname === foodDetailsMatchFromCategories?.pathname} />
          </Box>
        </Collapse>
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/orders'
          icon={<Notifications fontSize='small' />}
          text='Orders'
          selected={pathname === '/dashboard/orders' || pathname === orderDetailsMatch?.pathname}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/sales-history'
          icon={<History fontSize='small' />}
          text='Sales History'
          selected={pathname === '/dashboard/sales-history'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/customers'
          icon={<People fontSize='small' />}
          text='Customers'
          selected={pathname === '/dashboard/customers'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/suppliers'
          icon={<HolidayVillage fontSize='small' />}
          text='Suppliers'
          selected={pathname === '/dashboard/suppliers'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/meetings'
          icon={<Diversity3 fontSize='small' />}
          text='Meeting-Schedule'
          selected={pathname === '/dashboard/meetings'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/coupons'
          icon={<Discount fontSize='small' />}
          text='Coupons'
          selected={pathname === '/dashboard/coupons'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/invoice'
          icon={<Description fontSize='small' />}
          text='Invoice'
          selected={pathname === '/dashboard/invoice'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/brand'
          icon={<Business fontSize='small' />}
          text='Brand'
          selected={pathname === '/dashboard/brand'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/faq'
          icon={<LiveHelp fontSize='small' />}
          text='Faq'
          selected={pathname === '/dashboard/faq'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/promotion'
          icon={<Recommend fontSize='small' />}
          text='Promotion'
          selected={pathname === '/dashboard/promotion'}
        />
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/settings'
          icon={<Settings fontSize='small' />}
          text='Settings'
          selected={pathname === '/dashboard/settings'}
        />
      </Stack>
    </Box>
  );


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        color='white'
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box />
          {/* <TextField sx={{
            mr: { xs: 0, sm: 2, md: 20 },
            maxWidth: '700px',
            width: '100%'
          }}
            size='small'
            placeholder='Type to search'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{
                    display: { xs: 'none', md: 'block' }
                  }} />
                </InputAdornment>
              )
            }}
          /> */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <ClickAwayListener onClickAway={() => setOpenEmail(false)}>
              <Box sx={{
                position: 'relative'
              }}>
                <IconButton onClick={() => (
                  setOpenEmail(!openEmail),
                  setOpenNotification(false)
                )} sx={{ color: 'gray.main' }}>
                  <Badge badgeContent={4} color="error">
                    <MailOutline />
                  </Badge>
                </IconButton>
                <Collapse sx={{
                  position: 'absolute',
                  right: { xs: -80, md: 0 },
                  top: 55,
                  zIndex: 9999999
                }} in={openEmail}>
                  <Box sx={{
                    width: { xs: '90vw', sm: '300px', md: '350px' },
                    maxHeight: '500px',
                    overflowY: 'auto',
                    bgcolor: '#fff',
                    border: '1px solid gray',
                    borderRadius: '8px', p: '10px 20px',
                  }}>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum ipsam asperiores quasi dolor, recusandae sequi ducimus nam labore impedit quam?</p>
                  </Box>
                </Collapse>
              </Box>
            </ClickAwayListener>

            <ClickAwayListener onClickAway={() => setOpenNotification(false)}>
              <Box sx={{
                position: 'relative'
              }}>
                <IconButton onClick={() => (
                  setOpenNotification(!openNotification),
                  setOpenEmail(false)
                )} sx={{ color: 'gray.main' }} color="inherit"
                >
                  <Badge badgeContent={0} color="error">
                    <NotificationsNone />
                  </Badge>
                </IconButton>
                <Collapse sx={{
                  position: 'absolute',
                  right: { xs: -35, md: 0 },
                  top: 55,
                }} in={openNotification}>
                  <Box sx={{
                    width: { xs: '90vw', sm: '300px', md: '350px' },
                    maxHeight: '500px',
                    overflowY: 'auto',
                    zIndex: 99999,
                    bgcolor: '#fff',
                    border: '1px solid gray',
                    borderRadius: '8px', p: '10px 20px',
                  }}>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum ipsam asperiores quasi dolor, recusandae sequi ducimus nam labore impedit quam?</p>
                  </Box>
                </Collapse>
              </Box>
            </ClickAwayListener>
            {/* user menu */}
            <Box>
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuOpen}
                id="account-menu"
                open={open}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                PaperProps={paperProps}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem sx={{ width: '200px' }} onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={() => (
                  handleUserMenuClose(),
                  handleLogout()
                )}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
            {/* user menu end */}
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1, p: 3,
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` }

        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box >
  );
}

export default Layout;