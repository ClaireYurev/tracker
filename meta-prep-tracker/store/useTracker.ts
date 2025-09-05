'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, isTuesday, isFriday, parseISO } from 'date-fns';
import { enumerateDays, isRestWeekend, startOfWeekISO, toISO } from '@/lib/dates';
import type { DayEntry, Settings, Task, WeekGoal } from '@/types/tracker';

type State = {
  days: Record<string, DayEntry>;
  weeks: Record<string, WeekGoal>;
  settings: Settings;
  currentUserId: number | null;
};

type Actions = {
  initCalendar: (untilISO?: string) => void;
  upsertDay: (entry: DayEntry) => void;
  setTaskProgress: (dateISO: string, taskId: string, value: number) => void;
  toggleTaskComplete: (dateISO: string, taskId: string, completed: boolean) => void;
  setTaskNotes: (dateISO: string, taskId: string, notes: string) => void;
  incrementPomodoro: (dateISO: string) => void;
  clearUserData: () => void;
  setCurrentUser: (userId: number) => void;
  setWeekGoals: (weekStartISO: string, goals: Partial<Record<string, number>>) => void;
  setSettings: (patch: Partial<Settings>, extendCalendar?: boolean) => void;
  exportJSON: () => string;
  importJSON: (json: string, replace?: boolean) => void;
  applyWeekGoals: (weekStartISO: string) => void;
};

const defaultSettings = (): Settings => ({
  interviewDateISO: '2025-10-20',
  studyStartISO: new Date().toISOString().slice(0, 10),
  everyOtherWeekendRest: true,
  pomodoroMinutes: 50,
  shortBreakMinutes: 10,
  longBreakMinutes: 20,
  longBreakEvery: 4,
});

function defaultTasksForDay(dateISO: string, isRest: boolean): Task[] {
  if (isRest) {
    return [
      { id: 'rest1', title: 'Active recovery: light review/flashcards', category: 'Behavioral', unit: 'minutes', target: 30, done: 0 },
      { id: 'rest2', title: 'Walk/stretch', category: 'Behavioral', unit: 'minutes', target: 20, done: 0 },
    ];
  }
  const d = parseISO(dateISO);
  const tasks: Task[] = [
    { id: 'sql', title: 'SQL Practice', category: 'SQL', unit: 'questions', target: 4, done: 0 },
    { id: 'py', title: 'Python Data Structures', category: 'Python', unit: 'problems', target: 1, done: 0 },
    { id: 'lc', title: 'LeetCode Mediums', category: 'LeetCode', unit: 'problems', target: 2, done: 0 },
    { id: 'sd', title: 'System Design', category: 'SystemDesign', unit: 'minutes', target: 45, done: 0 },
    { id: 'beh', title: 'Behavioral STAR Reps', category: 'Behavioral', unit: 'minutes', target: 20, done: 0 },
  ];
  if (isTuesday(d) || isFriday(d)) {
    tasks.push({ id: 'mock', title: 'Mock Interview', category: 'MockInterview', unit: 'blocks', target: 1, done: 0 });
  }
  return tasks;
}

export const useTracker = create<State & Actions>()(
  persist(
    (set, get) => ({
      days: {},
      weeks: {},
      settings: defaultSettings(),
      currentUserId: null,

      setCurrentUser: (userId: number) => {
        set({ currentUserId: userId });
      },

      clearUserData: () => {
        set({
          days: {},
          weeks: {},
          settings: defaultSettings(),
        });
      },

      initCalendar: (untilISO) => {
        const { settings, days } = get();
        const startISO = settings.studyStartISO;
        const endISO = untilISO || settings.interviewDateISO;
        if (!startISO || !endISO) return;
        const startMonday = startOfWeekISO(new Date(settings.studyStartISO));
        const newDays: Record<string, DayEntry> = { ...days };
        for (const dateISO of enumerateDays(startISO, endISO)) {
          const dateObj = parseISO(dateISO);
          let isRest = false;
          if (settings.everyOtherWeekendRest) {
            isRest = isRestWeekend(dateObj, 0, startMonday);
          }
          if (!newDays[dateISO]) {
            newDays[dateISO] = {
              dateISO,
              isRestDay: isRest,
              tasks: defaultTasksForDay(dateISO, isRest),
              notes: '',
              pomodoros: 0,
              blocksCompleted: 0,
            };
          } else {
            // ensure rest flag & mock task presence are up to date
            newDays[dateISO].isRestDay = isRest;
            const ids = new Set(newDays[dateISO].tasks.map(t => t.id));
            const defaultTasks = defaultTasksForDay(dateISO, isRest);
            for (const t of defaultTasks) {
              if (!ids.has(t.id)) newDays[dateISO].tasks.push(t);
            }
          }
        }
        set({ days: newDays });
      },

      upsertDay: (entry) => {
        const days = { ...get().days, [entry.dateISO]: entry };
        set({ days });
      },

      setTaskProgress: (dateISO, taskId, value) => {
        const days = { ...get().days };
        const day = days[dateISO];
        if (!day) return;
        day.tasks = day.tasks.map(t => {
          if (t.id !== taskId) return t;
          const done = Math.max(0, value);
          const completed = t.target != null ? done >= (t.target ?? 0) : t.completed ?? false;
          return { ...t, done, completed };
        });
        set({ days });
      },

      toggleTaskComplete: (dateISO, taskId, completed) => {
        const days = { ...get().days };
        const day = days[dateISO];
        if (!day) return;
        day.tasks = day.tasks.map(t => t.id === taskId ? { ...t, completed: !!completed } : t);
        set({ days });
      },

      setTaskNotes: (dateISO, taskId, notes) => {
        const days = { ...get().days };
        const day = days[dateISO];
        if (!day) return;
        day.tasks = day.tasks.map(t => t.id === taskId ? { ...t, notes } : t);
        set({ days });
      },

      incrementPomodoro: (dateISO) => {
        const days = { ...get().days };
        const day = days[dateISO];
        if (!day) return;
        day.pomodoros = (day.pomodoros || 0) + 1;
        set({ days });
      },

      setSettings: (patch, extendCalendar = false) => {
        const settings = { ...get().settings, ...patch };
        set({ settings });
        if (extendCalendar) {
          get().initCalendar(settings.interviewDateISO);
        }
      },

      setWeekGoals: (weekStartISO, goals) => {
        const weeks = { ...get().weeks };
        weeks[weekStartISO] = { weekStartISO, goals };
        set({ weeks });
      },

      exportJSON: () => {
        const { days, weeks, settings } = get();
        return JSON.stringify({ days, weeks, settings }, null, 2);
      },

      importJSON: (json, replace = false) => {
        const parsed = JSON.parse(json);
        if (replace) {
          set({
            days: parsed.days ?? {},
            weeks: parsed.weeks ?? {},
            settings: parsed.settings ?? defaultSettings(),
          });
        } else {
          set((prev) => ({
            days: { ...prev.days, ...(parsed.days ?? {}) },
            weeks: { ...prev.weeks, ...(parsed.weeks ?? {}) },
            settings: { ...prev.settings, ...(parsed.settings ?? {}) },
          }));
        }
      },

      applyWeekGoals: (weekStartISO) => {
        const { weeks, days } = get();
        const wg = weeks[weekStartISO];
        if (!wg) return;

        const updated = { ...days };
        for (let i = 0; i < 7; i++) {
          const dateISO = toISO(addDays(parseISO(weekStartISO), i));
          const entry = updated[dateISO];
          if (!entry) continue;
          if (entry.isRestDay) continue;

          // Simple distribution: spread category totals across Mon-Sun, slightly heavier Tue/Thu
          const weight = [1, 1.2, 1, 1.2, 1, 0.7, 0.7][i]; // Mon..Sun
          entry.tasks = entry.tasks.map(t => {
            const weekly = wg.goals[t.category as keyof typeof wg.goals];
            if (!weekly || t.unit === 'blocks') return t;
            const base = Math.ceil((weekly / 5) * weight / 1.1); // bias to weekdays
            return { ...t, target: Math.max(1, base) };
          });
        }
        set({ days: updated });
      },
    }),
    {
      name: 'mpt-v1-default',
    }
  )
);
