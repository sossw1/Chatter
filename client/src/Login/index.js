import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login(props) {
  const { setUser } = props;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async function (e) {
    e.preventDefault();
    const url = 'http://localhost:3000/api/users/login';
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
          <input type='text' name='email' placeholder='Email' onChange={handleEmail} required />
          <label>Password</label>
          <input type='password' name='password' placeholder='Password' onChange={handlePassword} required />
          <button>Login</button>
        </form>
        <p>Don't have an account? Sign up <Link to='/signup'>here</Link></p>
      </div>
    </div>
  )
}
