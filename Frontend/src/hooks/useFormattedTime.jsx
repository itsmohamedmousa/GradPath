import { useMemo } from 'react';

export function useFormattedTime(mysqlTimeString) {
  return useMemo(() => {
    if (!mysqlTimeString) return '';

    const date = new Date(mysqlTimeString);
    if (isNaN(date.getTime())) return '';

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${hours}:${formattedMinutes} ${ampm}`;
  }, [mysqlTimeString]);
}
