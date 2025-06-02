import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkPassword = (pass) => {
    if (password !== pass) {
      document.getElementById('re-password').classList.add('is-invalid');
    } else {
      document.getElementById('re-password').classList.remove('is-invalid');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Frontend validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          university: university || null,
          major: major || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Show success message
        alert('Registration successful!');
        
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check if your backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="logo-container">
        <img className="logo" src="/src/assets/Logo-no-bg-landscape.png" alt="logo" />
      </div>
      <h2 className="register-title text-center">Register</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

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
              disabled={loading}
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="form-floating">
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-floating">
            <input
              type="text"
              id="university"
              className="form-control"
              placeholder=""
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="university">University (Optional)</label>
          </div>

          <div className="form-floating">
            <input
              type="text"
              id="major"
              className="form-control"
              placeholder=""
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="major">Major (Optional)</label>
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
              disabled={loading}
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
              disabled={loading}
            />
            <label htmlFor="re-password">Confirm Password</label>
          </div>
        </div>
        
        <button
          type="submit"
          className={`btn btn-primary ${
            (password.length > 0) &&
            (email.length > 0) &&
            (username.length > 0) &&
            (password === confirmPassword) &&
            !loading
              ? ''
              : 'disabled'
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Registering...
            </>
          ) : (
            'Register'
          )}
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