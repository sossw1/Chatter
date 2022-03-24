import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className='centered-form'>
      <div className='centered-form__box'>
        <h1>Sign up!</h1>
        <form action='/rooms.html'>
          <label>Username</label>
          <input type='text' name='username' placeholder='Username' required />
          <label>Email</label>
          <input type='text' name='email' placeholder='Email' required />
          <label>Password</label>
          <input type='password' name='password' placeholder='Password' required />
          <button>Create Account</button>
        </form>
        <p>Already have an account? Log in <Link to='/'>here</Link></p>
      </div>
    </div>
  )
}