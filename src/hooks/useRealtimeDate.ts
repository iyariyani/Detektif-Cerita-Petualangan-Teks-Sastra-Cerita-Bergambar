import { useEffect, useState } from 'react';

export function formatIndonesianDateTime(date: Date): {
  hariTanggal: string;
  waktuWib: string;
  fullLabel: string;
} {
  const hariTanggal = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const waktuWib = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  return {
    hariTanggal,
    waktuWib,
    fullLabel: `${hariTanggal} · ${waktuWib}`,
  };
}

export function useRealtimeDate() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return formatIndonesianDateTime(now);
}
