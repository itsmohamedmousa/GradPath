import { useMemo } from 'react';

export function useFormattedDate(mysqlTimeString) {
  return useMemo(() => {
    if (!mysqlTimeString) return '';

    const date = new Date(mysqlTimeString);
    if (isNaN(date.getTime())) return '';

    const weekday = date.toLocaleString('default', { weekday: 'long' });
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();

    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${weekday}, ${month} ${day}${getOrdinal(day)}`;
  }, [mysqlTimeString]);
}
