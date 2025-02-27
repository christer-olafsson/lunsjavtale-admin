import { useQuery } from '@apollo/client';
import { Business, Discount, ExpandLess, ExpandMore, FiberManualRecord, History, HolidayVillage, Instagram, KeyboardArrowRightOutlined, LiveHelp, LunchDining, MapOutlined, NotificationsNone, People, Recommend, Settings, ShoppingCartCheckoutOutlined, SpaceDashboard } from '@mui/icons-material'
import { Badge, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { ORDERS } from './orders/graphql/query';
import { UNREAD_ADMIN_NOTIFICATIONCOUNT } from './notification/graphql/query';
import { COMPANIES } from '../graphql/query';

const NavItem = ({ handleDrawerClose }) => {
  const [expandedNavlinkIndex, setExpandedNavlinkIndex] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [placedOrders, setPlacedOrders] = useState([])
  const [newCompanies, setNewCompanies] = useState([])
  const [newMeetings, setNewMeetings] = useState([])
  const [newWithdrawReq, setNewWithdrawReq] = useState([])


  useQuery(UNREAD_ADMIN_NOTIFICATIONCOUNT, {
    onCompleted: (res) => {
      setUnreadNotifications(res.unreadAdminNotificationCount)
    }
  });

  useQuery(ORDERS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      const relevantStatuses = ['Placed', 'Updated', 'Payment-pending', 'Payment-completed'];
      setPlacedOrders(res.orders.edges
        .filter(item => relevantStatuses.includes(item.node.status))
        .map(item => item.node)
      );
    }
  });

  useQuery(COMPANIES, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      setNewCompanies(res.companies.edges.filter(item => !item.node.isChecked).map(item => item.node))
    },
  });

  //  useQuery(FOOD_MEETINGS, {
  //     fetchPolicy: 'network-only',
  //     notifyOnNetworkStatusChange: true,
  //     onCompleted: (res) => {
  //       setNewMeetings(res.foodMeetings.edges.filter(item => item.node.status === 'pending').map(item => item.node))
  //     }
  //   });

  //   useQuery(WITHDRAW_REQ, {
  //     fetchPolicy: "network-only",
  //     notifyOnNetworkStatusChange: true,
  //     onCompleted: (res) => {
  //       setNewWithdrawReq(res.withdrawRequests.edges.filter(item => item.node.status === 'pending').map(item => item.node))
  //     },
  //   });



  const handleExpandedNavlink = (index) => {
    setExpandedNavlinkIndex(expandedNavlinkIndex === index ? null : index);
  };


  const navItems = [
    { name: 'Dashboard', icon: <SpaceDashboard fontSize='small' />, path: '/', end: true },
    { name: 'Notifications', icon: <NotificationsNone fontSize='small' />, path: '/dashboard/notifications', notification: unreadNotifications.length },
    {
      name: 'Food Menu', icon: <LunchDining fontSize='small' />, more: [
        { name: 'Food Item', path: '/dashboard/food-item' },
        { name: 'Categories', path: '/dashboard/food-categories' },
      ]
    },
    { name: 'Orders', icon: <ShoppingCartCheckoutOutlined fontSize='small' />, path: '/dashboard/orders', notification: placedOrders.length },
    { name: 'Payments', icon: <History fontSize='small' />, path: '/dashboard/payments-history' },
    { name: 'Customers', icon: <People fontSize='small' />, path: '/dashboard/customers', notification: newCompanies.length },
    {
      name: 'Suppliers', icon: <HolidayVillage fontSize='small' />, more: [
        { name: 'Suppliers', path: '/dashboard/suppliers' },
        { name: 'Sales-History', path: '/dashboard/sales-history' },
        // { name: 'Withdraw-Req', path: '/dashboard/withdraw-req' },
      ]
    },
    { name: 'Coupons', icon: <Discount fontSize='small' />, path: '/dashboard/coupons' },
    { name: 'Areas', icon: <MapOutlined fontSize='small' />, path: '/dashboard/areas' },
    { name: 'Brand', icon: <Business fontSize='small' />, path: '/dashboard/brand' },
    { name: 'Faq', icon: <LiveHelp fontSize='small' />, path: '/dashboard/faq' },
    { name: 'Social', icon: <Instagram fontSize='small' />, path: '/dashboard/social' },
    { name: 'Promotion', icon: <Recommend fontSize='small' />, path: '/dashboard/promotion' },
    { name: 'Settings', icon: <Settings fontSize='small' />, path: '/dashboard/settings' },
  ]

  return (
    <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {navItems.map((item, index) => (
        <ListItem disablePadding key={index} sx={{ display: 'block' }}>
          {item.more ? (
            <>
              <ListItemButton
                sx={{ px: 1, mx: 2, borderRadius: '5px', mb: 0.5, color: '#fff' }}
                onClick={() => handleExpandedNavlink(index)}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
                {expandedNavlinkIndex === index ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={expandedNavlinkIndex === index} timeout="auto" unmountOnExit>
                <List component="div">
                  {item.more.map((subItem, id) => (
                    <NavLink
                      onClick={handleDrawerClose}
                      className="link"
                      key={id}
                      to={subItem.path}
                    >
                      {({ isActive }) => (
                        <ListItemButton
                          sx={{
                            ml: 5,
                            mr: 2,
                            mb: 0.5,
                            borderRadius: '5px',
                            bgcolor: isActive ? '#fff' : '',
                            color: isActive ? '#000' : 'lightgray',
                            ':hover': {
                              bgcolor: isActive ? '#fff' : '',
                            },
                          }}
                        >
                          <FiberManualRecord sx={{ fontSize: '12px', mr: 1 }} />
                          <Typography sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                            {subItem.name}
                          </Typography>
                        </ListItemButton>
                      )}
                    </NavLink>
                  ))}
                </List>
              </Collapse>
            </>
          ) : (
            <NavLink end={item.end} className="link" to={item.path}>
              {({ isActive }) => (
                <Stack
                  direction='row'
                  alignItems='center'
                  onClick={handleDrawerClose}
                  sx={{
                    py: 1,
                    px: 1,
                    mx: 2,
                    borderRadius: '5px',
                    bgcolor: isActive ? '#fff' : '',
                    color: isActive ? 'primary.main' : '#fff',
                    // ':hover': {
                    //   bgcolor: isActive ? '#fff' : 'gray',
                    // },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: isActive ? 'primary.main' : '#fff' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  <Badge sx={{ mx: 2 }} badgeContent={item.notification} color="warning" />
                </Stack>
              )}
            </NavLink>
          )}
        </ListItem>
      ))}
    </List>
  )
}

export default NavItem