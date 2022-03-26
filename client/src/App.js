import './App.css';
import Login from './Login';
import Signup from './Signup';
import Rooms from './Rooms';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login setUser={setUser} />} />
        <Route path='/signup' element={<Signup setUser={setUser} />} />
        <Route path='/rooms' element={<Rooms rooms={user.rooms} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
