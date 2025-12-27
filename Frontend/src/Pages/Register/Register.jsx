import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, GraduationCap } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    major: '',
    totalCredits: '',
    completedCredits: '',
    cumulativeGpa: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { show } = useToastContext();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'confirmPassword' || field === 'password') {
      setPasswordsMatch(
        field === 'confirmPassword'
          ? value === formData.password
          : formData.confirmPassword === value || formData.confirmPassword === '',
      );
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordHidden(!passwordHidden);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      show('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      show('Password must be at least 6 characters long', 'warning');
      setLoading(false);
      return;
    }

    // Validate numeric fields
    if (
      formData.totalCredits &&
      (isNaN(formData.totalCredits) || parseFloat(formData.totalCredits) < 0)
    ) {
      show('Total credits must be a valid positive number', 'error');
      setLoading(false);
      return;
    }

    if (
      formData.completedCredits &&
      (isNaN(formData.completedCredits) || parseFloat(formData.completedCredits) < 0)
    ) {
      show('Completed credits must be a valid positive number', 'error');
      setLoading(false);
      return;
    }

    if (
      formData.cumulativeGpa &&
      (isNaN(formData.cumulativeGpa) ||
        parseFloat(formData.cumulativeGpa) < 0 ||
        parseFloat(formData.cumulativeGpa) > 4)
    ) {
      show('Cumulative GPA must be between 0 and 4', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/register.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          university: formData.university || null,
          major: formData.major || null,
          totalCredits: formData.totalCredits || null,
          completedCredits: formData.completedCredits || null,
          cumulativeGpa: formData.cumulativeGpa || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        show('Registration successful', 'success');
        navigate('/login');
      } else {
        show(data.message || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      show('Network error. Please check if your backend server is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.username.length > 0 &&
    formData.email.length > 0 &&
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.totalCredits.length > 0 &&
    formData.completedCredits.length > 0 &&
    formData.cumulativeGpa.length > 0 &&
    passwordsMatch &&
    !loading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
          {/* Logo Container */}
          <div className="flex justify-center mb-6">
            <img
              className="h-16 sm:h-20 w-auto"
              src="/src/assets/Logo-no-bg-landscape.png"
              alt="logo"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us to track your academic journey</p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Account Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                <User className="w-5 h-5 text-blue-600" />
                Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Username *
                  </label>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Email *
                  </label>
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={passwordHidden ? 'password' : 'text'}
                    id="password"
                    className="peer w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Password *
                  </label>
                  {(formData.password.length > 0 || formData.confirmPassword.length > 0) && (
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={passwordHidden ? 'Show password' : 'Hide password'}
                    >
                      {passwordHidden ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    type={passwordHidden ? 'password' : 'text'}
                    id="confirmPassword"
                    className={`peer w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${
                      !passwordsMatch && formData.confirmPassword.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label
                    htmlFor="confirmPassword"
                    className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm ${
                      !passwordsMatch && formData.confirmPassword.length > 0
                        ? 'text-red-600 peer-placeholder-shown:text-red-400 peer-focus:text-red-600'
                        : 'text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600'
                    }`}
                  >
                    Confirm Password *
                  </label>
                  {!passwordsMatch && formData.confirmPassword.length > 0 && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Academic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* University */}
                <div className="relative">
                  <input
                    type="text"
                    id="university"
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    placeholder="University"
                    value={formData.university}
                    onChange={(e) => handleChange('university', e.target.value)}
                    disabled={loading}
                  />
                  <label
                    htmlFor="university"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    University (Optional)
                  </label>
                </div>

                {/* Major */}
                <div className="relative">
                  <input
                    type="text"
                    id="major"
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    placeholder="Major"
                    value={formData.major}
                    onChange={(e) => handleChange('major', e.target.value)}
                    disabled={loading}
                  />
                  <label
                    htmlFor="major"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Major (Optional)
                  </label>
                </div>

                {/* Total Credits */}
                <div className="relative">
                  <input
                    type="number"
                    id="totalCredits"
                    min="0"
                    step="1"
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    placeholder="Total Credits"
                    value={formData.totalCredits}
                    onChange={(e) => handleChange('totalCredits', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label
                    htmlFor="totalCredits"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Total Credits *
                  </label>
                </div>

                {/* Completed Credits */}
                <div className="relative">
                  <input
                    type="number"
                    id="completedCredits"
                    min="0"
                    step="1"
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    placeholder="Completed Credits"
                    value={formData.completedCredits}
                    onChange={(e) => handleChange('completedCredits', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label
                    htmlFor="completedCredits"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Completed Credits *
                  </label>
                </div>

                {/* Cumulative GPA */}
                <div className="relative md:col-span-2">
                  <input
                    type="number"
                    id="cumulativeGpa"
                    min="0"
                    max="4"
                    step="0.01"
                    className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    placeholder="Cumulative GPA"
                    value={formData.cumulativeGpa}
                    onChange={(e) => handleChange('cumulativeGpa', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <label
                    htmlFor="cumulativeGpa"
                    className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Cumulative GPA (0.00 - 4.00) *
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className={`w-full py-3.5 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!isFormValid}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
