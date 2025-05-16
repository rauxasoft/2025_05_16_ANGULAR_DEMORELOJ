export interface ChronoEvent {
    totalSegundos: number;
    estado: 'STOPPED' | 'RUNNING' | 'PAUSED';
    sentido: 'UP' | 'DOWN'
}