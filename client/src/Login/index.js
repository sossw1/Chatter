import { useAuth } from '../Providers/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
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
    const response = await auth.login(email, password);
    if (response.ok) {
      navigate('/rooms');
    } else {
      // display error to user
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
