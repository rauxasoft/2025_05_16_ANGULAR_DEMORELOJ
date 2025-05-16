import { Component, signal } from '@angular/core';
import { CronoConsoleComponent } from "./cronometro/crono-console/crono-console.component";
import { CronoConsoleConfig } from './cronometro/crono-console/crono-console-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CronoConsoleComponent]
})
export class AppComponent {

  configuracion: CronoConsoleConfig = {
    mostrarEstado: false,
    mostrarSentido: false,
    mostrarBotones: true,
    formatoTiempo: 'completo',
    botones: {
      start: 'Iniciar',
      pause: 'Pausar',
      resume: 'Reanudar',
      reset: 'Resetear'
    }
  };
}
