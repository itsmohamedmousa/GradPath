import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempted with:', username);
    // In a real app, you would call an authentication API here
  };

  return (
    <div className="login-container">
      <div className="logo text-center" onClick={() => navigate('/')}>
        <i className="bi bi-mortarboard" />
        <h1 className="logo-name">GradPath</h1>
      </div>
      <h2 className="login-title text-center">Login</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-floating">
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder=""
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="form-floating">
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
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
