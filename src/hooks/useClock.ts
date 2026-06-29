import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm:ss');
}

export function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy');
}

export function formatDateTime(date: Date): string {
  return format(date, 'dd MMM yyyy, HH:mm:ss');
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'EEEE, dd MMMM yyyy');
}
