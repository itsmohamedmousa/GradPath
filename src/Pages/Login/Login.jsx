import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';
import useBootstrap from '../../hooks/useBootstrap';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  useBootstrap();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const hidePassword = () => {
    setPasswordHidden(!passwordHidden);
  };

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic frontend validation
    if (!username || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/src/backend/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Use the auth context login function
        login(data.data.user, data.data.token, data.data.sessionId);

        // Redirect to the page they were trying to access, or dashboard
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check if your backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img className="logo" src="/src/assets/Logo-no-bg-landscape.png" alt="logo" />
      </div>
      <h2 className="login-title text-center">Login</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <div className="form-floating">
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder=""
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            <label htmlFor="username">Username or Email</label>
          </div>
          <div className="form-floating">
            <input
              type={passwordHidden ? 'password' : 'text'}
              id="password"
              className="form-control"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <label htmlFor="password">Password</label>
            {password.length > 0 && (
              <div className="eye" onClick={hidePassword}>
                {passwordHidden ? <EyeOff /> : <Eye />}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`login-btn btn btn-primary ${
            password.length > 0 && username.length > 0 && !loading ? '' : 'disabled'
          }`}
          disabled={loading || !username || !password}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <div className="login-footer text-center">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
