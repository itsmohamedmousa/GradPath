import { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const { data: notesData, isLoading, error, refresh } = useFetch('notes', []);
  return (
    <NotesContext.Provider value={{ data: notesData, loadingNotes: isLoading, errorNotes: error, refreshNotes: refresh }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);