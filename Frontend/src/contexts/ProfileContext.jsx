import { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { data: profileData, isLoading, error, refresh } = useFetch('profile', []);
  return ( 
    <ProfileContext.Provider value={{ data: profileData, loadingProfile: isLoading, errorProfile: error, refreshProfile: refresh }}>
      {children}
    </ProfileContext.Provider>
   );
}

export const useProfile = () => useContext(ProfileContext);