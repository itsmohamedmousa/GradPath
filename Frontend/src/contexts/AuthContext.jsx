import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedSessionId = localStorage.getItem('sessionId');

        if (storedToken && storedUser) {
          // Validate token with backend (optional but recommended)
          const isValid = await validateToken(storedToken);
          
          if (isValid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setSessionId(storedSessionId);
          } else {
            // Token is invalid, clear storage
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    const interval = setInterval(async () => {
    if (token) {
      const stillValid = await validateToken(token);
      if (!stillValid) {
        console.warn('Token expired or invalid — logging out.');
        logout();
      }
    }
  }, 60 * 1000);

  return () => clearInterval(interval);
  }, [token]);

  // Validate token with backend
  const validateToken = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/validate-token.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.success;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Login function
  const login = (userData, userToken, userSessionId) => {
    setUser(userData);
    setToken(userToken);
    setSessionId(userSessionId);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    localStorage.setItem('sessionId', userSessionId);
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API to invalidate session
      if (token) {
        await fetch(`${apiUrl}/logout.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuthData();
    }
  };

  // Clear authentication data
  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    setSessionId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
  };

  const value = {
    user,
    token,
    sessionId,
    loading,
    login,
    logout,
    isAuthenticated,
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};