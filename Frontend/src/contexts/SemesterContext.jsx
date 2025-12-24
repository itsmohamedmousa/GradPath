import { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';

const SemesterContext = createContext();

export function SemesterProvider({ children }) {
  const { data: semester, isLoading, error, refresh } = useFetch('semester', []);

  return (
    <SemesterContext.Provider
      value={{
        currentSemester: semester,
        loadingSemester: isLoading,
        errorSemester: error,
        refreshSemester: refresh,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
}

export const useSemester = () => useContext(SemesterContext);
