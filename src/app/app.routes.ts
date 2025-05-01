import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { UpdateTaskComponent } from './components/update-task/update-task.component';
import { TaskViewComponent } from './components/task-view/task-view.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'create', component: TaskFormComponent },
  { path: 'read/:id', component: TaskViewComponent },
  { path: 'update/:id', component: UpdateTaskComponent },
  { path: '**', redirectTo: '' },
];