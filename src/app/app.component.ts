import { Component } from '@angular/core';
import { CronoConsoleComponent } from "./cronometro/crono-console/crono-console.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CronoConsoleComponent]
})
export class AppComponent {

}
