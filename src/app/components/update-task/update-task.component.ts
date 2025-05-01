import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { Task, TaskStatus } from '../../core/models/task.model';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './update-task.component.html',
  providers: [DatePipe]
})
export class UpdateTaskComponent implements OnInit {
  
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly datePipe = inject(DatePipe);

  public today = new Date().toISOString().split('T')[0];
  public updateForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: '',
    date: ['', Validators.required],
    status: ['', Validators.required],
  });

  private taskId: string | null = null;

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.service.getTaskById(this.taskId).subscribe(
        (task) => {
          const formattedDate = this.formatDateForInput(task.date);
          this.updateForm.patchValue({
            ...task,
            date: formattedDate,
          });
        },
        (error) => {
          console.error('Error fetching task:', error);
          alert('Error fetching task. Please try again.');
        }
      );
    }
  }

  private formatDateForInput(dateString: string): string {
    return this.datePipe.transform(dateString, 'yyyy-MM-dd') || '';
  }

  onSubmit(): void {
    if (this.updateForm.valid && this.taskId) {
      const formValue = this.updateForm.value;
      const selectedDate = new Date(formValue.date || '');

      if (isNaN(selectedDate.getTime())) {
        alert('Invalid date format. Please correct it.');
        return;
      }

      selectedDate.setHours(23, 59, 0, 0);
      const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');

      const updatedTask: Task = {
        id: this.taskId,
        title: formValue.title || '',
        description: formValue.description || '',
        status: formValue.status as TaskStatus || 'à faire',
        date: formattedDate || '',
      };

      this.service.updateTask(updatedTask).subscribe(
        () => {
          alert('Task updated successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error updating task:', error);
          alert('Error updating task. Please try again.');
        }
      );
    } else {
      alert('Form is invalid. Please fill out all required fields.');
    }
  }
}