import { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';

const EventContext = createContext();

export function EventProvider({ children }) {
  const { data: eventData, isLoading, error, refresh } = useFetch('events', []);

  const API_URL = `${import.meta.env.VITE_API_URL}/events.php`;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // Create new event
  const createEvent = async (eventData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const data = await response.json();

      // Refresh the events list
      await refresh();

      return { success: true, event: data.event };
    } catch (err) {
      console.error('Error creating event:', err);
      return { success: false, error: err.message };
    }
  };

  // Update event
  const updateEvent = async (eventData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      const data = await response.json();

      // Refresh the events list
      await refresh();

      return { success: true, event: data.event };
    } catch (err) {
      console.error('Error updating event:', err);
      return { success: false, error: err.message };
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }

      // Refresh the events list
      await refresh();

      return { success: true };
    } catch (err) {
      console.error('Error deleting event:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <EventContext.Provider
      value={{
        data: eventData,
        loadingEvent: isLoading,
        errorEvent: error,
        refreshEvent: refresh,
        createEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEvent = () => useContext(EventContext);
