import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Badge' {
  interface BadgePropsColorOverrides {
    neutral: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c5cbf'
    },
    neutral: {
      main: '#bdbdbd'
    }
  }
});

export default theme;
