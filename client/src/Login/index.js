import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsername = (e) => {
    setUsername(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  return (
    <div className='centered-form'>
      <div className='centered-form__box'>
        <h1>Login</h1>
        <form>
          <label>Username</label>
          <input type='text' name='username' placeholder='Username' onChange={handleUsername} required />
          <label>Password</label>
          <input type='password' name='password' placeholder='Password' onChange={handlePassword} required />
          <button>Login</button>
        </form>
        <p>Don't have an account? Sign up <Link to='/signup'>here</Link></p>
      </div>
    </div>
  )
}
