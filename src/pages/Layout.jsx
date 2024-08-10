/* eslint-disable react/prop-types */
import { useEffect, useReducer, useState } from 'react';
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
import { AccountCircle, Business, Description, Discount, Diversity3, FiberManualRecord, FiberManualRecordOutlined, History, HolidayVillage, Instagram, KeyboardArrowRight, LiveHelp, Logout, LunchDining, MailOutline, MapOutlined, Notifications, NotificationsNone, People, PinDrop, Recommend, RequestPageOutlined, Search, Security, Settings, ShoppingCartCheckoutOutlined, SpaceDashboard, Timeline, TimelineOutlined, } from '@mui/icons-material';
import { Avatar, Badge, ClickAwayListener, Collapse, InputAdornment, Menu, MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import { LOGOUT } from './login/graphql/mutation';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from '@apollo/client';
import { ADMIN_NOTIFICATIONS, UNREAD_ADMIN_NOTIFICATIONCOUNT } from './notification/graphql/query';
import SmallNotification from './notification/SmallNotification';
import { ORDERS } from './orders/graphql/query';
import { COMPANIES, ME } from '../graphql/query';
import { FOOD_MEETINGS } from './meeting/graphql/query';
import { WITHDRAW_REQ } from './withdraw-req/graphql/query';


const drawerWidth = 264;

const ListBtn = ({ style, text, icon, link, selected, onClick, expandIcon, expand, subItem, notification }) => {
  return (
    <Link onClick={onClick} className='link' to={link}>
      <Box sx={{
        width: '100%',
        display: 'inline-flex',
        whiteSpace: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: '4px',
        overflow: 'hidden',
        // mb: 1,
        color: selected ? 'primary.main' : '#95A2B0',
        bgcolor: selected ? 'light.main' : '',
        ...style,
        position: 'relative',
        cursor: 'pointer',
        ":hover": {
          color: selected ? 'inherit' : '#fff'
        },
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
          {subItem ?
            <FiberManualRecord sx={{ fontSize: '13px' }} /> :
            icon
          }
          <Typography sx={{
            color: 'gray',
            fontSize: '15px',
            fontWeight: 400, ml: 1
          }}>{text}</Typography>
        </Box>
        {notification && <Badge sx={{ mr: .5 }} badgeContent={notification} color="error" />}
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
  const [expandFoodMenu, setExpandFoodMenu] = useState(false)
  const [expandSuppliers, setExpandSuppliers] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [placedOrders, setPlacedOrders] = useState([])
  const [newCompanies, setNewCompanies] = useState([])
  const [newMeetings, setNewMeetings] = useState([])
  const [newWithdrawReq, setNewWithdrawReq] = useState([])

  const { pathname } = useLocation();
  const orderDetailsMatch = useMatch('/dashboard/orders/details/:id')
  const foodDetailsMatchFromItem = useMatch('/dashboard/food-item/food-details/:id')
  const foodDetailsMatchFromCategories = useMatch('/dashboard/food-categories/food-details/:id')


  const { data: user } = useQuery(ME)
  console.log(user)
  useQuery(UNREAD_ADMIN_NOTIFICATIONCOUNT, {
    onCompleted: (res) => {
      setUnreadNotifications(res.unreadAdminNotificationCount)
    }
  });

  useQuery(ORDERS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      setPlacedOrders(res.orders.edges.filter(item => item.node.status === 'Placed').map(item => item.node));
    }
  });

  useQuery(COMPANIES, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setNewCompanies(res.companies.edges.filter(item => !item.node.isChecked).map(item => item.node))
    },
  });

  useQuery(FOOD_MEETINGS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      setNewMeetings(res.foodMeetings.edges.filter(item => item.node.status === 'pending').map(item => item.node))
    }
  });

  useQuery(WITHDRAW_REQ, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      setNewWithdrawReq(res.withdrawRequests.edges.filter(item => item.node.status === 'pending').map(item => item.node))
    },
  });

  // useQuery(ADMIN_NOTIFICATIONS, {
  //   fetchPolicy: 'network-only',
  //   notifyOnNetworkStatusChange: true,
  //   onCompleted: (res) => {
  //     setNotifications(res.adminNotifications.edges.filter(item => !item.node.isSeen).map(item => item.node))
  //   }
  // });


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

  useEffect(() => {
    if (newWithdrawReq.length > 0) {
      setExpandSuppliers(true)
    }
  }, [newWithdrawReq])


  useEffect(() => {
    if (pathname === '/dashboard/food-item' || pathname === '/dashboard/food-categories') {
      setExpandFoodMenu(true)
    }
    if (pathname === '/dashboard/suppliers' || pathname === '/dashboard/sales-history' || pathname === '/dashboard/withdraw-req') {
      setExpandSuppliers(true)
    }
  }, [pathname])


  const drawer = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      alignItems: 'center',
      bgcolor: '#1E293B',
      // height: '100%',
      height: '200vh',
      pb: 3
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
          notification={unreadNotifications > 0 ? unreadNotifications : ''}
          onClick={handleDrawerClose}
          link='/dashboard/notifications' icon={<NotificationsNone fontSize='small' />} text='Notifications'
          selected={pathname === '/dashboard/notifications'} />
        <ListBtn onClick={() => setExpandFoodMenu(!expandFoodMenu)}
          expandIcon
          expand={expandFoodMenu || pathname === '/dashboard/food-item'}
          icon={<LunchDining fontSize='small' />}
          text='Food Menu'
        // selected={
        //   pathname === '/dashboard/food-item'
        //   || pathname === '/dashboard/food-categories'
        //   || pathname === foodDetailsMatchFromItem?.pathname
        //   || pathname === foodDetailsMatchFromCategories?.pathname
        // }
        />
        <Collapse in={expandFoodMenu} timeout="auto" unmountOnExit>
          <Box sx={{ ml: 3 }}>
            <ListBtn
              onClick={handleDrawerClose}
              link='/dashboard/food-item'
              text='Food Item'
              subItem
              selected={pathname === '/dashboard/food-item' || pathname === foodDetailsMatchFromItem?.pathname}
            />
            <ListBtn
              onClick={handleDrawerClose}
              link='/dashboard/food-categories'
              text='Food Categories'
              selected={pathname === '/dashboard/food-categories' || pathname === foodDetailsMatchFromCategories?.pathname}
              subItem
            />
          </Box>
        </Collapse>
        {
          user?.me?.role !== 'seo-manager' &&
          <>
            < ListBtn onClick={handleDrawerClose}
              notification={placedOrders.length > 0 ? placedOrders.length : ''}
              link='/dashboard/orders'
              icon={<ShoppingCartCheckoutOutlined fontSize='small' />}
              text='Orders'
              selected={pathname === '/dashboard/orders' || pathname === orderDetailsMatch?.pathname}
            />
            <ListBtn onClick={handleDrawerClose}
              link='/dashboard/payments-history'
              icon={<History fontSize='small' />}
              text='Payment-History'
              selected={pathname === '/dashboard/payments-history'}
            />
          </>
        }
        <ListBtn onClick={handleDrawerClose}
          notification={newCompanies.length > 0 ? newCompanies.length : ''}
          link='/dashboard/customers'
          icon={<People fontSize='small' />}
          text='Customers'
          selected={pathname === '/dashboard/customers'
            // || pathname === customerDetailsMatch?.pathname
          }
        />
        <ListBtn onClick={handleDrawerClose}
          notification={newMeetings.length > 0 ? newMeetings.length : ''}
          link='/dashboard/meetings'
          icon={<Diversity3 fontSize='small' />}
          text='Meetings'
          selected={pathname === '/dashboard/meetings'}
        />
        <ListBtn onClick={() => setExpandSuppliers(!expandSuppliers)}
          icon={<HolidayVillage fontSize='small' />}
          text='Suppliers'
          expandIcon
          expand={expandSuppliers}
        // selected={pathname === '/dashboard/suppliers'}
        />
        {
          <Collapse in={expandSuppliers}>
            <Box sx={{ ml: 3 }}>
              <ListBtn
                onClick={handleDrawerClose}
                link='/dashboard/suppliers'
                text='All Suppliers'
                subItem
                selected={pathname === '/dashboard/suppliers'}
              />
              {
                user?.me?.role !== 'seo-manager' &&
                <>
                  <ListBtn
                    onClick={handleDrawerClose}
                    link='/dashboard/sales-history'
                    text='Sales-History'
                    subItem
                    selected={pathname === '/dashboard/sales-history'}
                  />
                  <ListBtn
                    notification={newWithdrawReq.length > 0 ? newWithdrawReq.length : ''}
                    onClick={handleDrawerClose}
                    link='/dashboard/withdraw-req'
                    text='Withdraw-Req'
                    subItem
                    selected={pathname === '/dashboard/withdraw-req'}
                  />
                </>
              }
            </Box>
          </Collapse>
        }
        <ListBtn onClick={handleDrawerClose}
          link='/dashboard/coupons'
          icon={<Discount fontSize='small' />}
          text='Coupons'
          selected={pathname === '/dashboard/coupons'}
        />
        <ListBtn
          onClick={handleDrawerClose}
          link='/dashboard/areas' icon={<MapOutlined fontSize='small' />} text='Areas'
          selected={pathname === '/dashboard/areas'} />
        {/* <ListBtn onClick={handleDrawerClose}
          link='/dashboard/invoice'
          icon={<Description fontSize='small' />}
          text='Invoice'
          selected={pathname === '/dashboard/invoice'}
        /> */}
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
          link='/dashboard/social'
          icon={<Instagram fontSize='small' />}
          text='Social'
          selected={pathname === '/dashboard/social'}
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
    <Box sx={{
      display: 'flex',
      minHeight: '100vh'
    }}>
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
            alignItems: 'center',
          }}>

            {/* small notification */}
            <ClickAwayListener onClickAway={() => setOpenNotification(false)}>
              <Box sx={{
                position: 'relative'
              }}>
                <IconButton onClick={() => (
                  setOpenNotification(!openNotification),
                  setOpenEmail(false)
                )} sx={{ color: 'darkgray' }} color="inherit"
                >
                  <Badge badgeContent={unreadNotifications} color="error">
                    <NotificationsNone sx={{ fontSize: '30px' }} />
                  </Badge>
                </IconButton>
                {
                  openNotification &&
                  <Collapse sx={{
                    position: 'absolute',
                    right: 0,
                  }} in={openNotification}>
                    <SmallNotification onClose={() => setOpenNotification(false)} />
                  </Collapse>
                }
              </Box>
            </ClickAwayListener>
            {/* user menu */}
            <ClickAwayListener onClickAway={() => setUsermenuOpen(false)}>
              <Box sx={{ position: 'relative' }}>
                <Stack direction='row' alignItems='center'
                  onClick={() => setUsermenuOpen(!userMenuOpen)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Avatar src={user?.me.photoUrl ? user?.me.photoUrl : ''} sx={{ width: 32, height: 32 }} />
                  <Box ml={1}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 600,lineHeight:'20px' }}>{user?.me.username}</Typography>
                    <Typography sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: .3,
                      fontSize: '12px',
                      textAlign: 'center',
                      bgcolor: user?.me.role === 'admin' || user?.me.isSuperuser ?
                        'purple' : 'darkgray',
                      pl: 1,
                      pr: user?.me.isSuperuser ? .5 : 1,
                      borderRadius: '50px',
                      color: '#fff'
                    }}>
                      {user?.me.role}
                      {user?.me.isSuperuser &&
                        <Security fontSize='small' />
                      }
                    </Typography>
                  </Box>
                </Stack>

                <Collapse sx={{
                  position: 'absolute',
                  top: 65,
                  right: 0,
                  minWidth: '250px',
                  pt: 2,
                  bgcolor: '#fff',
                  boxShadow: 3,
                  borderRadius: '8px'
                }} in={userMenuOpen}>
                  <Stack sx={{ width: '100%' }} alignItems='center'>
                    <Avatar src={user?.me.photoUrl ?? ''} sx={{ width: '100px', height: '100px', mb: 2 }} />
                    <Typography sx={{ fontSize: '20px', textAlign: 'center' }}>{user?.me.username}</Typography>
                    <Typography sx={{ textAlign: 'center', fontSize: '14px' }}>{user?.me.email}</Typography>
                    <Typography sx={{ textAlign: 'center', fontSize: '14px', mb: 2 }}>{user?.me.phone}</Typography>
                    {/* <MenuItem onClick={() => setUsermenuOpen(false)}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem> */}
                    <Divider sx={{ width: '100%' }} />
                    <MenuItem onClick={() => (
                      setUsermenuOpen(false),
                      handleLogout()
                    )}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Stack>
                </Collapse>

              </Box>
            </ClickAwayListener>
            {/* user menu end */}

            {/* <Box>
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>L</Avatar>
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
                <Link style={{ textDecoration: 'none' }} className='link' to='dashboard/settings'>
                  <MenuItem onClick={handleUserMenuClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                </Link>
                <Divider />
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
            </Box> */}

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