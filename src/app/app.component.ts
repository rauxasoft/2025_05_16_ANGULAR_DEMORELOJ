import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CronoEngineComponent } from './cronometro/crono-engine/crono-engine.component';

@Component({
  selector: 'app-root',
  imports: [CronoEngineComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  control = signal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'>('reset');
  totalSegundos = 0;
  estado = '';
  sentido = '';
}
