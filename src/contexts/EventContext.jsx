import { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';

const EventContext = createContext();

export function EventProvider({ children }) {
  const { data: eventData, isLoading, error, refresh } = useFetch('events', []);
  return ( 
    <EventContext.Provider value={{ data: eventData, loadingEvent: isLoading, errorEvent: error, refreshEvent: refresh }}>
      {children}
    </EventContext.Provider>
   );
}

export const useEvent = () => useContext(EventContext);