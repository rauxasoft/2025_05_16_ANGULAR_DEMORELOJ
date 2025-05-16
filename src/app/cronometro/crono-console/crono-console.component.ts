import { Component, signal } from '@angular/core';
import { CronoEngineComponent } from "../crono-engine/crono-engine.component";
import { ChronoEvent } from '../chrono-event.model';

@Component({
  selector: 'app-crono-console',
  imports: [CronoEngineComponent],
  templateUrl: './crono-console.component.html',
  styleUrl: './crono-console.component.css'
})
export class CronoConsoleComponent {
  control = signal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'>('reset');
  cronometro?: ChronoEvent;
}
