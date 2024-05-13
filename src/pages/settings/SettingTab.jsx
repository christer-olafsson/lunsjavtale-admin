import { Delete } from "@mui/icons-material";
import { Avatar, Box, Button, Paper, Stack, Tab, Tabs, Typography, styled, tabClasses, tabsClasses, useMediaQuery } from "@mui/material";
import PropTypes from 'prop-types';
import { useState } from "react";
import GeneralSettings from "./tabs/GeneralSettings";
import UserManagemenet from "./tabs/UserManagemenet";
import PaymentSettings from "./tabs/PaymentSettings";
import NotificationSettings from "./tabs/NotificationSettings";


const TabItem = styled(Tab)(({ theme }) => ({
  position: "relative",
  borderRadius: "4px",
  textAlign: "center",
  textTransform: 'none',
  transition: "all .5s",
  padding: "5px 10px",
  color: "#555555",
  height: "auto",
  marginRight: '10px',
  float: "none",
  fontSize: "14px",
  [theme.breakpoints.up("md")]: {
    minWidth: 120,
  },
  [`&.${tabClasses.selected}`]: {
    backgroundColor: '#fff',
    border: '1px solid lightgray'
  },
}));

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

const tabName = [
  'General Settings', 'User Management', 'Payment Settings ', 'Notification Settings ',
]

const SettingTab = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));


  return (
    <Paper elevation={isMobile ? 0 : 4}>
      <Stack direction='row' sx={{ justifyContent: 'center', }}>
        <Tabs
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          value={tabIndex}
          onChange={(e, index) => setTabIndex(index)}
          sx={{
            width: "100%",
            bgcolor: 'light.main',
            borderRadius: '8px',
            py: 2,
            [`& .${tabsClasses.indicator}`]: {
              display: "none",
            },
          }}
        >
          {
            tabName.map((item) => (
              <TabItem key={item} disableRipple label={item} />
            ))
          }
        </Tabs>
      </Stack>

      <Box maxWidth='lg' sx={{ p: { xs: 1, lg: 3 } }}>
        <CustomTabPanel value={tabIndex} index={0}><GeneralSettings /></CustomTabPanel>
        <CustomTabPanel value={tabIndex} index={1}><UserManagemenet /></CustomTabPanel>
        <CustomTabPanel value={tabIndex} index={2}><PaymentSettings /></CustomTabPanel>
        <CustomTabPanel value={tabIndex} index={3}><NotificationSettings /></CustomTabPanel>
      </Box>

    </Paper>
  )
}

export default SettingTab