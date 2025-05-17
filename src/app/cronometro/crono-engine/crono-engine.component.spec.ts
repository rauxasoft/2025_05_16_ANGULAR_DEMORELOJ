import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { CronoEngineComponent } from './crono-engine.component';
import { signal, WritableSignal } from '@angular/core';

describe('CronoEngineComponent', () => {
  let component: CronoEngineComponent;
  let fixture: ComponentFixture<CronoEngineComponent>;
  let controlSignal: WritableSignal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronoEngineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronoEngineComponent);
    component = fixture.componentInstance;
    controlSignal = signal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'>('reset');
    fixture.componentRef.setInput('control', controlSignal);
    fixture.detectChanges();

  });

  it('debería poner el estado en RUNNING y empezar a contar al recibir "start"', fakeAsync(() => {

    controlSignal.set('start');
    tick(10);  // Valor 10 para permitir que el effect se dispare y setInterval se inicie
    fixture.detectChanges();
    tick(2000); // Simular dos segundos
    
    expect(component['state']()).toBe('RUNNING');
    expect(component['totalSeconds']()).toBeGreaterThanOrEqual(2);

    flush(); // limpia el interval

  }));

   it('debería pausar el cronómetro al recibir "pause"', fakeAsync(() => {
    controlSignal.set('start');
    tick(10);
    fixture.detectChanges();
    tick(1000); // simular 1 segundo de conteo

    controlSignal.set('pause');
    tick(10); // dejar tiempo al efecto para reaccionar
    fixture.detectChanges();
    const pausedAt = component['totalSeconds']();

    tick(1000); // esperar otro segundo (debería estar pausado)
    expect(component['state']()).toBe('PAUSED');
    expect(component['totalSeconds']()).toBe(pausedAt); // no debe avanzar

    flush(); // limpiar interval
  }));

  it('debería reanudar el cronómetro al recibir "resume" tras "pause"', fakeAsync(() => {
    controlSignal.set('start');
    tick(10);
    fixture.detectChanges();
    tick(1000); // simular 1 segundo de conteo

    controlSignal.set('pause');
    tick(10);
    fixture.detectChanges();
    const pausedAt = component['totalSeconds']();

    tick(1000); // cronómetro en pausa, no debe avanzar
    expect(component['totalSeconds']()).toBe(pausedAt);

    controlSignal.set('resume');
    tick(10);
    fixture.detectChanges();
    tick(1000); // otro segundo tras reanudar

    expect(component['state']()).toBe('RUNNING');
    expect(component['totalSeconds']()).toBeGreaterThan(pausedAt);

    flush();
  }));

  it('debería reiniciar el cronómetro al recibir "reset"', fakeAsync(() => {
    controlSignal.set('start');
    tick(10);
    fixture.detectChanges();
    tick(1000); // simular 1 segundo de conteo

    expect(component['totalSeconds']()).toBeGreaterThan(0);

    controlSignal.set('reset');
    tick(10);
    fixture.detectChanges();

    expect(component['state']()).toBe('STOPPED');
    expect(component['totalSeconds']()).toBe(0);

    tick(1000); // comprobar que no sigue contando
    expect(component['totalSeconds']()).toBe(0);

    flush();
  }));

  it('debería contar hacia atrás en modo "down" y detenerse en 0', fakeAsync(() => {
    // Suponemos que puedes fijar el tiempo inicial manualmente
    component['totalSeconds'].set(5); // empezar desde 5 segundos
    component['state'].set('PAUSED');

    controlSignal.set('down');
    tick(10);
    fixture.detectChanges();

    controlSignal.set('resume');
    tick(10);
    fixture.detectChanges();

    tick(6000); // 6 segundos de ejecución
    fixture.detectChanges();

    expect(component['totalSeconds']()).toBe(0);
    expect(component['state']()).toBe('STOPPED');
    expect(component['direction']()).toBe(1);
    
    flush();
  }));

  it('debería cambiar de "down" a "up" en ejecución y reflejar el totalSeconds esperado', fakeAsync(() => {
    // Estado inicial
    component['totalSeconds'].set(10);
    component['state'].set('PAUSED');
    component['direction'].set(-1); // down

    // Iniciar conteo hacia atrás
    controlSignal.set('resume');
    tick(10);
    fixture.detectChanges();

    tick(2000); // bajar 2 → total = 8
    fixture.detectChanges();

    // Cambiar dirección a 'up'
    controlSignal.set('up');
    tick(10);
    fixture.detectChanges();

    tick(4000); // subir 4 → total = 12
    fixture.detectChanges();

    // Pausar
    controlSignal.set('pause');
    tick(10);
    fixture.detectChanges();

    // Verificaciones finales
    expect(component['totalSeconds']()).toBe(12);
    expect(component['state']()).toBe('PAUSED');
    expect(component['direction']()).toBe(1); // dirección ascendente

    flush();
  }));

  it('debería continuar desde el mismo valor tras "pause" y "resume"', fakeAsync(() => {
    // Condiciones iniciales
    component['totalSeconds'].set(0);
    component['direction'].set(1); // modo ascendente

    controlSignal.set('start');
    tick(10);
    fixture.detectChanges();

    tick(3000); // contar 3 segundos
    fixture.detectChanges();
    controlSignal.set('pause');
    tick(10);
    fixture.detectChanges();

    const pausedAt = component['totalSeconds']();
    expect(pausedAt).toBe(3); // asegurar valor intermedio

    tick(1000); // tiempo extra en pausa (no debe contar)
    expect(component['totalSeconds']()).toBe(3);

    controlSignal.set('resume');
    tick(10);
    fixture.detectChanges();

    tick(2000); // continuar 2 segundos más
    fixture.detectChanges();

    expect(component['totalSeconds']()).toBe(5);
    expect(component['state']()).toBe('RUNNING');
    expect(component['direction']()).toBe(1);

    flush();
  }));

  it('debería detenerse al llegar a 0 en modo "down" y cambiar dirección a "up"', fakeAsync(() => {
    component['totalSeconds'].set(1);
    component['direction'].set(-1);
    component['state'].set('PAUSED');

    controlSignal.set('resume');
    tick(10);
    fixture.detectChanges();

    tick(2000); // simular 1 segundo para bajar a 0
    fixture.detectChanges();

    expect(component['totalSeconds']()).toBe(0);
    expect(component['state']()).toBe('STOPPED');
    expect(component['direction']()).toBe(1);

    flush();
  }));

  it('debería reiniciarse correctamente desde estado "PAUSED" al recibir "reset"', fakeAsync(() => {
    component['totalSeconds'].set(25);
    component['state'].set('PAUSED');
    component['direction'].set(-1); // modo descendente

    //controlSignal.set('reset'); // esto no provocará que effect() "se entere"
    controlSignal = signal<'reset'>('reset');
    fixture.componentRef.setInput('control', controlSignal);

    tick(10);
    fixture.detectChanges();

    expect(component['totalSeconds']()).toBe(0);
    expect(component['state']()).toBe('STOPPED');
    expect(component['direction']()).toBe(1); // dirección reiniciada a ascendente

    flush();
  }));

  it('no debería crear múltiples intervalos si se llama a "resume" varias veces', fakeAsync(() => {
    component['totalSeconds'].set(0);
    component['state'].set('PAUSED');
    component['direction'].set(1);

    controlSignal.set('resume');
    tick(10);
    fixture.detectChanges();

    tick(1000); // +1 segundo

    controlSignal.set('resume'); // segunda llamada (no debería duplicar el interval)
    tick(10);
    fixture.detectChanges();

    tick(2000); // +2 segundos más
    fixture.detectChanges();

    controlSignal.set('pause');
    tick(10);
    fixture.detectChanges();

    expect(component['totalSeconds']()).toBe(3); // debe haber contado 3 segundos, no más
    expect(component['state']()).toBe('PAUSED');

    flush();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

// ng test
// 
