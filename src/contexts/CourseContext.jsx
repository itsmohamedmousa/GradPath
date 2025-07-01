import { createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const { data: courses, isLoading, error, refresh } = useFetch('courses', [], 'allCourses');
  return ( 
    <CourseContext.Provider value={{ data: courses, loadingCourses: isLoading, errorCourses: error, refreshCourses: refresh }}>
      {children}
    </CourseContext.Provider>
   );
}

export const useCourse = () => useContext(CourseContext);