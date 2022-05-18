import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Providers/auth';
import theme from './Providers/theme';
import Login from './Components/Login';

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Login />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
