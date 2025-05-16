import { Component, computed, input, signal, WritableSignal } from '@angular/core';
import { CronoEngineComponent } from "../crono-engine/crono-engine.component";
import { ChronoEvent } from '../chrono-event.model';
import { CronoConsoleConfig } from './crono-console-config';

@Component({
  selector: 'app-crono-console',
  imports: [CronoEngineComponent],
  templateUrl: './crono-console.component.html',
  styleUrl: './crono-console.component.css'
})
export class CronoConsoleComponent {
  control: WritableSignal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'> = signal('reset');
  cronometro?: ChronoEvent;
  cronoConsoleConfig = input<CronoConsoleConfig>();
  
  get config(): Required<CronoConsoleConfig>{
    
    const base = this.cronoConsoleConfig() ?? {};
    
    return {
      mostrarEstado: base.mostrarEstado ?? true,
      mostrarSentido: base.mostrarSentido ?? true,
      mostrarBotones: base.mostrarBotones ?? true,
      formatoTiempo: base.formatoTiempo ?? 'segundos',
      botones: {
        start: 'Start',
        pause: 'Pause',
        resume: 'Resume',
        reset: 'Reset',
        up: 'Up',
        down: 'Down',
        ...(this.cronoConsoleConfig()?.botones ?? {})
      }
    };
      
  }

  getDisplay(){

    const totalSegundos = this.cronometro?.totalSegundos ?? 0;

    const horas = ("0" + Math.floor(totalSegundos / 3600)).slice(-2);
    const minutos = ("0" + Math.floor(totalSegundos / 60 % 60)).slice(-2);
    const segundos = ("0" + Math.floor(totalSegundos % 60)).slice(-2);
    
    return `${horas}:${minutos}:${segundos}`;
  }

}
