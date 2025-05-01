import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('@components/task-list/task-list.component').then(m => m.TaskListComponent) },
  { path: 'create', loadComponent: () => import('@components/task-form/task-form.component').then(m => m.TaskFormComponent) },
  { path: 'read/:id', loadComponent: () => import('@components/task-view/task-view.component').then(m => m.TaskViewComponent) },
  { path: 'update/:id', loadComponent: () => import('@components/update-task/update-task.component').then(m => m.UpdateTaskComponent) },
  { path: '**', redirectTo: '' },
];