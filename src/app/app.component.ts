import { Component, signal } from '@angular/core';
import { CronoEngineComponent } from './cronometro/crono-engine/crono-engine.component';
import { ChronoEvent } from './cronometro/chrono-event.model';
import { CronoConsoleComponent } from "./cronometro/crono-console/crono-console.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CronoConsoleComponent]
})
export class AppComponent {

}
