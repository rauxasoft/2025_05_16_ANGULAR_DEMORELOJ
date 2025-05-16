import { Component, effect, input, output, signal, WritableSignal } from '@angular/core';
import { ChronoEvent } from '../chrono-event.model';

@Component({
  selector: 'app-crono-engine',
  template: ''
})
export class CronoEngineComponent {
  private intervalId: any = null;
  private totalSeconds = signal(0);
  private state = signal<'STOPPED' | 'RUNNING' | 'PAUSED'>('STOPPED');
  private direction = signal<number>(1);

  control = input<WritableSignal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'>>();
  evento = output<ChronoEvent>();

  constructor(){
    
    effect(() => {

      const controlSignal = this.control();

      if(controlSignal){
        const comando = controlSignal();
        switch (comando) {
          case 'start': this.start(); break;
          case 'pause': this.pause(); break;
          case 'resume': this.resume(); break;
          case 'reset': this.reset(); break;
          case 'up': this.up(); break;
          case 'down': this.down(); break;
        }
      }  
    });

    effect(() => {
      this.evento.emit({
        totalSegundos: this.totalSeconds(),
        estado: this.state(),
        sentido: this.direction() === 1 ? 'UP' : 'DOWN'
      });
    });
    
  }

  private start(){
    clearInterval(this.intervalId);
    this.totalSeconds.set(0);
    this.direction.set(1);
    this.resume();
  }

  private pause(){
    clearInterval(this.intervalId);
    this.state.set('PAUSED');
  }

  private resume(){
    this.state.set('RUNNING');
    this.intervalId = setInterval(() => {
      if (this.totalSeconds() === 0 && this.direction() === -1){
        this.reset();
      } else {
        this.totalSeconds.update((totalSeconds) => totalSeconds + this.direction());
        console.log(this.totalSeconds());
      }
    }, 500);
  }

  private reset(){
    clearInterval(this.intervalId);
    this.state.set('STOPPED');
    this.direction.set(1);
    this.totalSeconds.set(0);
  }

  private up(){
    this.direction.set(1);
  }

  private down(){
    this.direction.set(-1);
  }
}
