import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const checkPassword = (pass) => {
    if (password !== pass) {
      document.getElementById('re-password').classList.add('is-invalid');
    } else {
      document.getElementById('re-password').classList.remove('is-invalid');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle Register logic here
    console.log('Register attempted with:', username);
    // In a real app, you would call an authentication API here
  };

  return (
    <div className="register-container">
      <div className="logo text-center" onClick={() => navigate('/')}>
        <i className="bi bi-mortarboard" />
        <h1 className="logo-name">GradPath</h1>
      </div>
      <h2 className="register-title text-center">Register</h2>

      <form className="register-form" onSubmit={handleSubmit}>
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
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              id="re-password"
              className="form-control"
              placeholder=""
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                checkPassword(e.target.value);
              }}
              required
            />
            <label htmlFor="re-password">Confirm Password</label>
          </div>
        </div>
        <button
          type="submit"
          className={`btn btn-primary ${
            (password.length > 0) & (username.length > 0) & (password == confirmPassword)
              ? ''
              : 'disabled'
          }`}
        >
          Register
        </button>
        <div className="register-footer text-center">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
