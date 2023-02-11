import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import theme from './Providers/theme';
import { AuthProvider, RequireAuth } from './Providers/auth';
import { SocketProvider } from './Providers/socket';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Navigation from './Components/Navigation';
import Chat from './Components/Chat/Chat';
import Friend from './Components/Friend/Friend';
import NoMatch from './Components/NoMatch';

function App() {
  return (
    <>
      <CssBaseline />
      {/* Providers */}
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SocketProvider>
            {/* Routing */}
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
                  <Route path='/friend' element={<Friend />} />
                </Route>
                <Route path='*' element={<NoMatch />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
