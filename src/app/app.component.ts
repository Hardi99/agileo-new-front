import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeadingComponent } from './shared/heading/heading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
