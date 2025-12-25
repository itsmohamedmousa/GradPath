import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const { data: notesData, isLoading, error, refresh } = useFetch('notes', []);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Helper function for API calls
  const makeApiCall = async (method, urlSuffix = '', body = null) => {
    try {
      const url = `${apiUrl}/notes.php${urlSuffix}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (response.status === 401) {
        logout();
        navigate('/login', { replace: true });
        return null;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'API request failed');
      }

      return result;
    } catch (err) {
      console.error(`Error with ${method} request:`, err);
      return null;
    }
  };

  // Delete note function
  const deleteNote = async (noteId) => {
    const result = await makeApiCall('DELETE', `?id=${noteId}`);

    if (result && result.success) {
      await refresh();
      return true;
    }
    return false;
  };

  // Update note function
  const updateNote = async (noteId, updatedData) => {
    const result = await makeApiCall('PUT', '', {
      id: noteId,
      ...updatedData,
    });

    if (result && result.success) {
      await refresh();
      return true;
    }
    return false;
  };

  // Create note function
  const createNote = async (noteData) => {
    const result = await makeApiCall('POST', '', noteData);

    if (result && result.success) {
      await refresh();
      return result;
    }
    return false;
  };

  return (
    <NotesContext.Provider
      value={{
        data: notesData,
        loadingNotes: isLoading,
        errorNotes: error,
        refresh,
        deleteNote,
        updateNote,
        createNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);