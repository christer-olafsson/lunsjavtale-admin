/* eslint-disable react/prop-types */
import { Button, SwipeableDrawer } from '@mui/material';
import React from 'react'

const SlideDrawer = ({ children, toggleDrawer, openSlideDrawer }) => {

  return (
    <div>
      <React.Fragment>
        <SwipeableDrawer
          anchor='right'
          open={openSlideDrawer}
          onClose={toggleDrawer}
          onOpen={toggleDrawer}
        >
          {children}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  )
}

export default SlideDrawer