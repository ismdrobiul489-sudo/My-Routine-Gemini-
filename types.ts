
export interface RoutineItem {
  time: string;
  activity: string;
}

export type DayOfWeek = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type Routines = Record<DayOfWeek, RoutineItem[]>;

export interface ChecklistItem {
  id: string;
  task: string;
  checked: boolean;
  score: number;
}

export type Theme = 'light' | 'dark';

export type ActiveView = 'today' | 'routine' | 'checklist';
