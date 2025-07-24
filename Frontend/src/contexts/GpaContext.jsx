import { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';

const GpaContext = createContext();

export function GpaProvider({ children }) {
  const { data: gpaData, isLoading, error, refresh } = useFetch('gpa', []);
  return ( 
    <GpaContext.Provider value={{ data: gpaData, loadingGpa: isLoading, errorGpa: error, refreshGpa: refresh }}>
      {children}
    </GpaContext.Provider>
   );
}

export const useGpa = () => useContext(GpaContext);