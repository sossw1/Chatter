import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './Providers/auth';
import { socket, SocketContext } from './Providers/socket';
import theme from './Providers/theme';
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
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <SocketContext.Provider value={socket}>
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
            </SocketContext.Provider>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
