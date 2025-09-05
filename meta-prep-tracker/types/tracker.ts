export type Category =
  | 'SQL'
  | 'Python'
  | 'LeetCode'
  | 'SystemDesign'
  | 'Behavioral'
  | 'MockInterview';

export type Unit = 'questions' | 'problems' | 'minutes' | 'blocks';

export interface Task {
  id: string;
  title: string;
  category: Category;
  target?: number;
  unit?: Unit;
  done: number;
  notes?: string;
  completed?: boolean;
}

export interface DayEntry {
  dateISO: string; // YYYY-MM-DD
  isRestDay?: boolean;
  tasks: Task[];
  notes?: string;
  pomodoros?: number;
  blocksCompleted?: number; // 0-3, morning/afternoon/evening
}

export interface WeekGoal {
  weekStartISO: string; // Monday
  goals: Partial<Record<Category, number>>;
}

export interface Settings {
  interviewDateISO: string; // default 2025-10-20
  studyStartISO: string;    // default today
  everyOtherWeekendRest: boolean; // default true
  pomodoroMinutes: number;  // 50
  shortBreakMinutes: number;// 10
  longBreakMinutes: number; // 20
  longBreakEvery: number;   // 4
  notificationsEnabled?: boolean;
}
