import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div class='centered-form'>
      <div class='centered-form__box'>
        <h1>Login</h1>
        <form action='/rooms.html'>
          <label>Username</label>
          <input type='text' name='username' placeholder='Username' />
          <label>Password</label>
          <input type='password' name='password' placeholder='Password' required />
          <button>Login</button>
        </form>
        {/* Need to make this a link below */}
        <p>Don't have an account? Sign up <Link to='/signup'>here</Link></p>
      </div>
    </div>
  )
}
