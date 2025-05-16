import { Component, effect, input, output, signal, WritableSignal } from '@angular/core';

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

  totalSegundos = output<number>();
  estado = output<string>();
  sentido = output<string>();

  constructor(){
    
    // Reacciona a los cambios de la señal de control

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

    // Emite el tiempo cada vez que cambia

    effect(() => {
      this.totalSegundos.emit(this.totalSeconds()); 
    });

    // Emite el estado cada vez que cambia

    effect(() => {
      this.estado.emit(this.state());
    });

    // Emite el sentido cada vez que cambia

    effect(() => {
      this.sentido.emit(this.direction() === 1 ? 'UP' : 'DOWN');
    });

  }

  private start(){
    console.log('start');
    clearInterval(this.intervalId);
    this.totalSeconds.set(0);
    this.direction.set(1);
    this.resume();
  }

  private pause(){
    console.log('pause');
    clearInterval(this.intervalId);
    this.state.set('PAUSED');
  }

  private resume(){
    
    console.log('resume');

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
    console.log('reset');
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
