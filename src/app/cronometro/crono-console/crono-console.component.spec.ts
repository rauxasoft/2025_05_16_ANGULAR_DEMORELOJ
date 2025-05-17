import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CronoConsoleComponent } from './crono-console.component';

describe('CronoConsoleComponent', () => {
  let fixture: ComponentFixture<CronoConsoleComponent>;
  let controlSignal: WritableSignal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'>;
  let component: CronoConsoleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronoConsoleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CronoConsoleComponent);
    component = fixture.componentInstance;
    
    controlSignal = signal<'start' | 'pause' | 'resume' | 'reset' | 'up' | 'down'>('reset');
    component.control = controlSignal; // ✅ Asignamos la signal directamente

    fixture.detectChanges();
  });

  it('debería emitir "start" al hacer clic en el botón start', () => {
    const startButton = fixture.debugElement.query(By.css('[data-testid="start-btn"]'));
    startButton.nativeElement.click();
    fixture.detectChanges();

    expect(controlSignal()).toBe('start');
  });

  it('debería emitir "pause" al hacer clic en el botón pause', () => {

    // ⚠️ Habilitamos el botón simulando un estado válido
    component.cronometro = { totalSegundos: 10, estado: 'RUNNING', sentido: 'UP' };
    fixture.detectChanges();

    const pauseButton = fixture.debugElement.query(By.css('[data-testid="pause-btn"]'));
    pauseButton.nativeElement.click();
    fixture.detectChanges();

    expect(controlSignal()).toBe('pause');
  });

  it('debería emitir "resume" al hacer clic en el botón resume', () => {

    // Simulamos que el cronómetro está pausado para habilitar el botón
    component.cronometro = { totalSegundos: 20, estado: 'PAUSED', sentido: 'UP' };
    fixture.detectChanges();

    const resumeButton = fixture.debugElement.query(By.css('[data-testid="resume-btn"]'));
    resumeButton.nativeElement.click();
    fixture.detectChanges();

    expect(controlSignal()).toBe('resume');
  });

  it('debería emitir "reset" al hacer clic en el botón reset', () => {
    component.cronometro = { totalSegundos: 15, estado: 'PAUSED', sentido: 'UP' };
    fixture.detectChanges();

    const resetButton = fixture.debugElement.query(By.css('[data-testid="reset-btn"]'));
    resetButton.nativeElement.click();
    fixture.detectChanges();

    expect(controlSignal()).toBe('reset');
  });

  it('debería emitir "up" al hacer clic en el botón up', () => {
    component.cronometro = { totalSegundos: 10, estado: 'RUNNING', sentido: 'DOWN' };
    fixture.detectChanges();

    const upButton = fixture.debugElement.query(By.css('[data-testid="up-btn"]'));
    upButton.nativeElement.click();
    fixture.detectChanges();

    expect(controlSignal()).toBe('up');
  });

  it('debería emitir "down" al hacer clic en el botón down', () => {
    component.cronometro = { totalSegundos: 7, estado: 'RUNNING', sentido: 'UP' };
    fixture.detectChanges();

    const downButton = fixture.debugElement.query(By.css('[data-testid="down-btn"]'));
    downButton.nativeElement.click();
    fixture.detectChanges();

    expect(controlSignal()).toBe('down');
  });

  it('debería deshabilitar todos los botones excepto "start" cuando el estado es STOPPED', () => {
    component.cronometro = { totalSegundos: 0, estado: 'STOPPED', sentido: 'UP' };
    fixture.detectChanges();

    const getBtn = (testId: string) =>
      fixture.debugElement.query(By.css(`[data-testid="${testId}"]`)).nativeElement as HTMLButtonElement;

    expect(getBtn('start-btn').disabled).toBeFalse();
    expect(getBtn('pause-btn').disabled).toBeTrue();
    expect(getBtn('resume-btn').disabled).toBeTrue();
    expect(getBtn('reset-btn').disabled).toBeTrue();
    expect(getBtn('up-btn').disabled).toBeTrue();
    expect(getBtn('down-btn').disabled).toBeTrue();
  });

  it('debería deshabilitar el botón "up" si el sentido ya es UP', () => {
    component.cronometro = { totalSegundos: 12, estado: 'RUNNING', sentido: 'UP' };
    fixture.detectChanges();

    const upButton = fixture.debugElement.query(By.css('[data-testid="up-btn"]')).nativeElement as HTMLButtonElement;
    expect(upButton.disabled).toBeTrue();
  });

  it('debería deshabilitar el botón "down" si el sentido ya es DOWN', () => {
    component.cronometro = { totalSegundos: 12, estado: 'RUNNING', sentido: 'DOWN' };
    fixture.detectChanges();

    const downButton = fixture.debugElement.query(By.css('[data-testid="down-btn"]')).nativeElement as HTMLButtonElement;
    expect(downButton.disabled).toBeTrue();
  });

  it('debería deshabilitar el botón "resume" si el estado no es PAUSED', () => {
    component.cronometro = { totalSegundos: 8, estado: 'RUNNING', sentido: 'UP' };
    fixture.detectChanges();

    const resumeButton = fixture.debugElement.query(By.css('[data-testid="resume-btn"]')).nativeElement as HTMLButtonElement;
    expect(resumeButton.disabled).toBeTrue();
  });

  it('debería deshabilitar el botón "pause" si el estado no es RUNNING', () => {
    component.cronometro = { totalSegundos: 8, estado: 'PAUSED', sentido: 'UP' };
    fixture.detectChanges();

    const pauseButton = fixture.debugElement.query(By.css('[data-testid="pause-btn"]')).nativeElement as HTMLButtonElement;
    expect(pauseButton.disabled).toBeTrue();
  });

  // Test12
  it('debería deshabilitar el botón "reset" si el estado es STOPPED', () => {
    component.cronometro = { totalSegundos: 0, estado: 'STOPPED', sentido: 'UP' };
    fixture.detectChanges();

    const resetButton = fixture.debugElement.query(By.css('[data-testid="reset-btn"]')).nativeElement as HTMLButtonElement;
    expect(resetButton.disabled).toBeTrue();
  });

});
