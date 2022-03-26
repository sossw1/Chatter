import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
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

  return (
    <div className='centered-form'>
      <div className='centered-form__box'>
        <h1>Sign up!</h1>
        <form>
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