import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#63883B'
    },
    secondary: {
      main: '#121212',
    },
    light: {
      main: '#F5F5F5'
    },
    white: {
      main: '#fff'
    },
    gray: {
      main: 'gray'
    },
    text: {
      primary: '#52525B'
    },
  },
 mixins: {
    MuiDataGrid: {
      containerBackground: '#fbf8ff',
    },
  },
  components: {
    // MuiDataGrid: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: '#fbf8ff',
    //     },
    //     columnHeaders: {
    //       backgroundColor: '#E0E0E0', // Change this color to your desired header background color
    //     },
    //   },
    // },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          ":hover": {
            boxShadow: 'none'
          }
        }
      }
    }
  },
  typography: {
    fontFamily: [
      'Plus Jakarta Sans',
      'Roboto',
    ].join(','),
    h6:{
      fontSize: '16px',
      fontWeight: 600
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1368,
      xl: 1536,
    },
  }
})