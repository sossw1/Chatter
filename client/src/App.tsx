import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './Providers/auth';
import theme from './Providers/theme';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Chat from './Components/Chat';

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
              <Route
                path='/chat'
                element={
                  <RequireAuth>
                    <Chat />
                  </RequireAuth>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
