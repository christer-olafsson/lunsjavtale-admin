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
import { Link, NavLink, Outlet, useLocation, useMatch } from 'react-router-dom';
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
import NavItem from './NavItem';


const drawerWidth = 264;

const LinkBtn = ({ style, text, icon, link, onClick, expandIcon, expand, subItem, notification }) => {
  return (
    <NavLink onClick={onClick} className='link' to={link}>
      {
        ({ isActive }) => (
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
            color: !expandIcon && isActive ? 'primary.main' : 'lightgray',
            bgcolor: !expandIcon && isActive ? 'light.main' : '',
            ...style,
            position: 'relative',
            cursor: 'pointer',
            ":hover": {
              color: isActive ? '' : '#fff'
            },
            ":before": {
              position: 'absolute',
              display: !expandIcon && isActive ? 'block' : 'none',
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
                fontSize: subItem ? '12px' : '15px',
                fontWeight: 400, ml: 1
              }}>{text}</Typography>
            </Box>
            {notification && <Badge sx={{ mr: .5 }} badgeContent={notification} color="error" />}
            {expandIcon && <KeyboardArrowRight sx={{
              transition: '.3s ease',
              transform: expand ? 'rotate(90deg)' : 'rotate(0deg)'
            }} />}
          </Box>
        )
      }
    </NavLink>
  )
};

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUsermenuOpen] = useState(null);
  const [openNotification, setOpenNotification] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([])



  const { data: user } = useQuery(ME)

  useQuery(UNREAD_ADMIN_NOTIFICATIONCOUNT, {
    onCompleted: (res) => {
      setUnreadNotifications(res.unreadAdminNotificationCount)
    }
  });


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
      bgcolor: 'primary.main',
      // height: '100%',
      height: '200vh',
      pb: 3
    }}>
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'center', mt: 2,
      }}>
        <Link to='/'>
          <Box sx={{
            width: { xs: '150px', md: '180px' },
            mb: 5
          }}>
            <img style={{ width: '100%' }} src="/logo-white.png" alt="" />
          </Box>
        </Link>
      </Toolbar>

      {/* navitem, */}
      <NavItem handleDrawerClose={handleDrawerClose} />
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

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}>
            {
              import.meta.env.VITE_ENVIRONMENT === 'stage' &&
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'red' }}>Test Mode</Typography>
            }
            {/* small notification */}
            <ClickAwayListener onClickAway={() => setOpenNotification(false)}>
              <Box sx={{
                mr: 1
              }}>
                <IconButton onClick={() => setOpenNotification(!openNotification)} sx={{ color: 'darkgray' }} color="inherit"
                >
                  <Badge badgeContent={unreadNotifications} color="error">
                    <NotificationsNone sx={{ fontSize: '30px' }} />
                  </Badge>
                </IconButton>
                {
                  openNotification &&
                  <Collapse sx={{
                    position: 'absolute',
                    right: 10,
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
                  {/* <Avatar src={user?.me.photoUrl ? user?.me.photoUrl : ''} sx={{ width: 32, height: 32 }} /> */}
                  <Box ml={1}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}>{user?.me.username}</Typography>
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
                    {/* <Avatar src={user?.me.photoUrl ?? ''} sx={{ width: '100px', height: '100px', mb: 2 }} /> */}
                    <Typography sx={{ fontSize: '20px', textAlign: 'center' }}>{user?.me.username}</Typography>
                    <Typography sx={{ textAlign: 'center', fontSize: '14px', mb: 2 }}>{user?.me.email}</Typography>
                    {/* <Typography sx={{ textAlign: 'center', fontSize: '14px', mb: 2 }}>{user?.me.phone}</Typography> */}
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