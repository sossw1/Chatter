import { useAuth } from '../../Providers/auth';
import './styles.css';
import { Outlet } from 'react-router-dom';

export default function Navigation() {
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
  }

  return (
    <div>
      <nav>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <Outlet></Outlet>
    </div>
  )
}