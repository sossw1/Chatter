import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Rooms from './Components/Rooms';
import NoMatch from './Components/NoMatch';
import { AuthProvider, RequireAuth } from './Providers/auth';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Layouts/Navigation';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route element={<Navigation />}>
            <Route
              path='/rooms'
              element={
                <RequireAuth>
                  <Rooms />
                </RequireAuth>
              }
            ></Route>
          </Route>
          <Route path='*' element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
