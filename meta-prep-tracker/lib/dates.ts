'use client';
import {
  formatISO as dfFormatISO,
  startOfWeek,
  parseISO,
  eachDayOfInterval,
  isSaturday,
  isSunday,
  differenceInCalendarWeeks,
} from 'date-fns';

export const toISO = (d: Date) => dfFormatISO(d, { representation: 'date' });
export const formatISO = (d: Date) => dfFormatISO(d, { representation: 'date' });
export const startOfWeekISO = (d: Date) => toISO(startOfWeek(d, { weekStartsOn: 1 }));

export const enumerateDays = (startISO: string, endISO: string) =>
  eachDayOfInterval({ start: parseISO(startISO), end: parseISO(endISO) }).map(toISO);

// true if the given weekend is a REST weekend, alternating from the study-start Monday parity.
export function isRestWeekend(date: Date, baseEvenOdd = 0, startMondayISO?: string) {
  if (!isSaturday(date) && !isSunday(date)) return false;
  if (!startMondayISO) return true;
  const startMonday = parseISO(startMondayISO);
  const weeks = differenceInCalendarWeeks(date, startMonday, { weekStartsOn: 1 });
  const parity = (weeks + baseEvenOdd) % 2; // 0 rest, 1 study
  return parity === 0;
}

// get Monday ISO string for the week containing a given ISO date
export function mondayOfWeekISO(dateISO: string) {
  const d = parseISO(dateISO);
  const monday = startOfWeek(d, { weekStartsOn: 1 });
  return toISO(monday);
}
