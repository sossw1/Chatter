import './styles.css';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NoMatch() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/rooms');
    }, 4000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="centered-form">
      <div id="no-match__box" className="centered-form__box">
        <h1>Whoops!</h1>
        <h2>Nothing to see here at {location.pathname}</h2>
        <h2>Redirecting...</h2>
      </div>
    </div>
  )
}