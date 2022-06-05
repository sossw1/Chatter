import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './Providers/auth';
import theme from './Providers/theme';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Navigation from './Components/Navigation';
import Chat from './Components/Chat';
import NoMatch from './Components/NoMatch';

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
                element={
                  <RequireAuth>
                    <Navigation />
                  </RequireAuth>
                }
              >
                <Route path='/chat' element={<Chat />} />
              </Route>
              <Route path='*' element={<NoMatch />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
