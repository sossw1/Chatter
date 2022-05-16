import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Providers/auth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<h1>Login</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
