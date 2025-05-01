import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { Task, TaskStatus } from '../../core/models/task.model';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  providers: [DatePipe]
})
export class TaskFormComponent {

    private readonly fb = inject(FormBuilder);
    private readonly service = inject(TaskService);
    private route = inject(Router);
    private readonly datePipe = inject(DatePipe);

    public today = new Date().toISOString().split('T')[0];
    public addForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: '',
        date: ['', Validators.required],
        status: ['à faire', Validators.required],
      });

  private formatDateForInput(dateString: string): string {
    // Utiliser DatePipe pour formater la date au format YYYY-MM-DD
    return this.datePipe.transform(dateString, 'yyyy-MM-dd') || '';
  }

  onSubmit() {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;

      if (!formValue.date) {
        console.error('Date is missing or invalid');
        alert('Error: Date is missing or invalid.'); // Alert for missing or invalid date
        return;
      }

      const selectedDate = new Date(formValue.date);
      if (isNaN(selectedDate.getTime())) {
        console.error('Invalid date format');
        alert('Error: Invalid date format.'); // Alert for invalid date format
        return;
      }

      selectedDate.setHours(23, 59, 0, 0);
      const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');

      const newTask: Task = {
        title: formValue.title || '',
        description: formValue.description || '',
        status: formValue.status as TaskStatus || 'à faire' as TaskStatus,
        date: formattedDate || formValue.date || '',
      };

      this.service.createTask(newTask).subscribe(
        () => {
          alert('Task created successfully!'); // Success alert
          this.addForm.reset();
          this.route.navigate(['/']);
        },
        (error) => {
          console.error('Error creating task:', error);
          alert('Error creating task. Please try again.'); // Error alert
        }
      );
    } else {
      console.error('Form is invalid');
      alert('Error: Form is invalid. Please fill out all required fields.'); // Alert for invalid form
    }
  }
}