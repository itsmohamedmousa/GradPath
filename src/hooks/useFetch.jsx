import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for fetching data from an API endpoint
 * @param {string} endpoint - API endpoint to fetch from (e.g., 'category', 'products')
 * @param {Array} dependencies - Array of dependencies to trigger refetch (like refreshTrigger)
 * @param {string} action - Action to be performed (e.g., 'totalOrders', 'totalProducts')
 * @returns {Object} - Contains data, isLoading, error states and a refresh function
 */
const useFetch = (endpoint, dependencies = [], action = null) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  let url = `http://localhost:8000/src/backend/api/${endpoint}.php`;
  if (action) {
    url += `?action=${action}`;
  }

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.status === 401) {
        logout(); // Logout if token is expired
        setError('Session expired. Please log in again.');
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      setError(`Failed to fetch ${endpoint}: ${err.message}`);
      console.error(`Error fetching ${endpoint}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data, isLoading, error, refresh: fetchData
  };
};

export default useFetch;
