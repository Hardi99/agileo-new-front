import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { RouterModule, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-view.component.html',
})
export class TaskViewComponent implements OnInit {
  task$: Observable<Task> | undefined;

  private readonly service = inject(TaskService);
  private route = inject(Router);
  public today = new Date().toISOString().split('T')[0];
  public readonly id = input.required<string>();

  ngOnInit(): void {
    this.task$ = this.service.getTaskById(this.id()).pipe(tap(console.log));
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}