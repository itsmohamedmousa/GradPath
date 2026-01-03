import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import Loader from '../../components/Loader/Loader';
import { useToastContext } from '../../contexts/ToastContext';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { show } = useToastContext();

  useEffect(() => {
    if (!token) {
      show('Invalid or missing reset token', 'error');
      setValidatingToken(false);
      return;
    }

    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`${apiUrl}/validate-reset-token.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setTokenValid(true);
      } else {
        show(data.message || 'Invalid or expired reset token', 'error');
        setTokenValid(false);
      }
    } catch (error) {
      show('Network error. Please try again.', 'error');
      setTokenValid(false);
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!password || !confirmPassword) {
      show('All fields are required', 'error');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      show('Password must be at least 6 characters long', 'error');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      show('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/reset-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResetSuccess(true);
        show('Password reset successfully!', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        show(data.message || 'Failed to reset password', 'error');
      }
    } catch (error) {
      show('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
          <Loader />
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))] px-4">
        <div className="w-full max-w-md">
          <div className="bg-[rgb(var(--card))] rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[rgb(var(--text))] mb-2">Invalid Reset Link</h2>
            <p className="text-[rgb(var(--text-secondary))] mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))] px-4">
        <div className="w-full max-w-md">
          <div className="bg-[rgb(var(--card))] rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[rgb(var(--text))] mb-2">Password Reset Successfully!</h2>
            <p className="text-[rgb(var(--text-secondary))] mb-6">
              Your password has been reset. Redirecting to login...
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-[rgb(var(--card))] rounded-lg shadow-md p-6 sm:p-8">
          {/* Logo Container */}
          <div className="flex justify-center mb-6">
            <img
              className="h-16 sm:h-20 w-auto"
              src="/src/assets/Logo-no-bg-landscape.png"
              alt="logo"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[rgb(var(--text))] mb-2">
            Reset Password
          </h2>
          <p className="text-center text-[rgb(var(--text-secondary))] mb-6 text-sm">Enter your new password below</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div className="relative">
              <input
                type={passwordHidden ? 'password' : 'text'}
                id="password"
                className="peer w-full px-4 py-3 pr-12 border border-[rgb(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-[rgb(var(--card))] disabled:cursor-not-allowed"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 bg-[rgb(var(--card))] px-1 text-sm text-[rgb(var(--text-secondary))] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
              >
                New Password
              </label>
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPasswordHidden(!passwordHidden)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={passwordHidden ? 'Show password' : 'Hide password'}
                >
                  {passwordHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={confirmPasswordHidden ? 'password' : 'text'}
                id="confirmPassword"
                className="peer w-full px-4 py-3 pr-12 border border-[rgb(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-[rgb(var(--card))] disabled:cursor-not-allowed"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-4 -top-2.5 bg-[rgb(var(--card))] px-1 text-sm text-[rgb(var(--text-secondary))] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
              >
                Confirm Password
              </label>
              {confirmPassword.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmPasswordHidden(!confirmPasswordHidden)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={confirmPasswordHidden ? 'Show password' : 'Hide password'}
                >
                  {confirmPasswordHidden ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-[rgb(var(--text-secondary))]">
              <p>Password must be at least 6 characters long</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors duration-200 flex items-center justify-center gap-2 ${
                password.length >= 6 && confirmPassword.length >= 6 && !loading && password === confirmPassword
                  ? 'bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] cursor-pointer'
                  : 'bg-[rgb(var(--hover))] cursor-not-allowed'
              }`}
              disabled={loading || password !== confirmPassword || password.length < 6 || confirmPassword.length < 6}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
