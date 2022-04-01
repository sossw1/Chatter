import './App.css';
import Login from './Components/Login';
import Signup from './Signup';
import Rooms from './Components/Rooms';
import { AuthProvider, RequireAuth } from './Providers/auth';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route
            path='/rooms'
            element={
              <RequireAuth>
                <Rooms />
              </RequireAuth>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
