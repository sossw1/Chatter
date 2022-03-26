import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login(props) {
  const { setUser } = props;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    switch (e.target.id) {
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

  const handleSubmit = async function (e) {
    e.preventDefault();
    const url = '/api/users/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      const { user } = await response.json();
      setUser(user);
      navigate('/rooms');
    }
  }

  return (
    <div className='centered-form'>
      <div className='centered-form__box'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input id='email' type='text' name='email' placeholder='Email' onChange={handleChange} required />
          <label>Password</label>
          <input id='password' type='password' name='password' placeholder='Password' onChange={handleChange} required />
          <button>Login</button>
        </form>
        <p>Don't have an account? Sign up <Link to='/signup'>here</Link></p>
      </div>
    </div>
  )
}
