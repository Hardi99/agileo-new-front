import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { Observable, catchError, of, tap, switchMap } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  selectedTask: Task | null = null;
  errorMessage = '';

  private readonly service = inject(TaskService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  public today = new Date().toISOString().split('T')[0];
  
  todoForm = this.fb.group({
    task: [''],
  });

  ngOnInit(): void {
    this.loadTodos();
  }  

  loadTodos(): void {
    this.tasks$ = this.service.getTasks().pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors du chargement des tâches';
        console.error('Erreur:', error);
        return of([]);
      })
    );
  }

  addTodo(): void {
    const taskValue = this.todoForm.value.task;
    if (!taskValue) return;

    const newTodo: Task = { 
      title: taskValue, 
      description: '',
      date: new Date().toISOString(),
      status: 'à faire'
    };
    this.service.createTask(newTodo).subscribe({
      next: (createdTask) => {
        this.todoForm.reset();
        this.tasks$ = this.tasks$.pipe(
          tap(tasks => tasks.push(createdTask)) // Append the new task to the existing list
        );
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création de la tâche';
        console.error('Erreur:', error);
      }
    });
  }

  updateTodo(task: Task): void {
    const updatedTodo = { 
      ...task, 
      status: task.status === 'en cours' ? 'réalisée' as const : 'à faire' as const
    };
    this.service.updateTask(updatedTodo).subscribe({
      next: (updatedTask) => {
        this.tasks$ = this.tasks$.pipe(
          tap(tasks => {
            const index = tasks.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
              tasks[index] = updatedTask; // Update the task in the list
            }
          })
        );
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour de la tâche';
        console.error('Erreur:', error);
      }
    });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks$ = this.service.deleteTask(taskId).pipe(
        tap(() => {
          console.log('Task deleted successfully');
        }),
        switchMap(() => this.service.getTasks()), // Refresh the task list after deletion
        catchError((error) => {
          console.error('Error deleting task:', error);
          return of([]); // Return an empty array to avoid breaking the observable
        })
      );
    }
  }
}