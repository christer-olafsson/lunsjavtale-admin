import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1E293B'
      // main: '#63883B'
      // main: '#0288d1'
      // main: '#5A66F1'
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
    // lightGray: '#F5F5F5',
    // common: {
    //   black: '#121212',
    //   white: '#efefef',
    // }
  },
  components: {
    // MuiContainer: {
    //  styleOverrides:{
    //   // disableGutters:true
    //   root:{
    //     marginTop: '50px'
    //   }
    //  }
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