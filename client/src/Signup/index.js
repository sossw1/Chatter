import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup(props) {
  const { setUser } = props;
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    switch (e.target.id) {
      case 'username':
        setUsername(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:3000/api/users';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    if (response.ok) {
      const { user } = await response.json();
      setUser(user);
      navigate('/rooms');
    } else {
      const { error } = await response.json();
      console.log(error);
    }
  }

  return (
    <div className='centered-form'>
      <div className='centered-form__box'>
        <h1>Sign up!</h1>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input id='username' type='text' name='username' placeholder='Username' onChange={handleChange} required />
          <label>Email</label>
          <input id='email' type='text' name='email' placeholder='Email' onChange={handleChange} required />
          <label>Password</label>
          <input id='password' type='password' name='password' placeholder='Password' onChange={handleChange} required />
          <button>Create Account</button>
        </form>
        <p>Already have an account? Log in <Link to='/'>here</Link></p>
      </div>
    </div>
  )
}