import './App.css';
import Login from './Login';
import Signup from './Signup';
import Rooms from './Rooms';
import { AuthProvider } from './Providers/auth';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/rooms' element={<Rooms />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
