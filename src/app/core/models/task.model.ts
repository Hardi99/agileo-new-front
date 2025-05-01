export type TaskStatus = 'à faire' | 'en cours' | 'réalisée';

export type Theme = 'light' | 'dark';

export interface Task {
  id?: string;
  title: string;
  description: string;
  date: string;
  status: TaskStatus;
}