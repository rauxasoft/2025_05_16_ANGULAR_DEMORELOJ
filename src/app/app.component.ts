import { Component, signal } from '@angular/core';
import { CronoEngineComponent } from './cronometro/crono-engine/crono-engine.component';
import { ChronoEvent } from './cronometro/chrono-event.model';

@Component({
  selector: 'app-root',
  imports: [CronoEngineComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  control = signal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'>('reset');
  cronometro?: ChronoEvent;
}
