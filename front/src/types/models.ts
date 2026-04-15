import { EstadoCarro, EstadoIncidente, TipoEvento } from './enums';

// Representación de un carro por cuartel [cite: 11, 12]
export interface Carro {
  id: string;
  nombre: string;                   // Ej: "B-1"
  cuartelId: string;                // Visualización por cuartel [cite: 12]
  estado: EstadoCarro;              // Verde, Amarillo o Rojo [cite: 13]
}

// Catálogo predefinido de tipos de emergencia [cite: 8]
export interface TipoEmergencia {
  id: string;
  nombre: string;                   // Ej: "Incendio"
  carrosRequeridos: number;         // Cálculo automático [cite: 34]
  personalRequerido: number;        // Determinación de personal [cite: 35]
  codigoMorse: string;              // Generación de código Morse [cite: 37]
}

// Modelo central del incidente/emergencia [cite: 5]
export interface Incidente {
  id: string;
  tipoId: string;                   // Selección desde catálogo [cite: 8]
  ubicacion: {
    calle1: string;                 // Ingreso mediante dos calles [cite: 6]
    calle2: string;                 // Intersección [cite: 6]
    coordenadas: { lat: number; lng: number }; // Ubicación automática en mapa [cite: 7]
  };
  estado: EstadoIncidente;          // Estado actual del incidente [cite: 10]
  carrosAsignadosIds: string[];     // Asignación según reglas [cite: 17]
  historial: EventoIncidente[];     // Registro de eventos relevantes [cite: 23]
  fechaCreacion: Date;
}

// Registro detallado de eventos de un llamado [cite: 23]
export interface EventoIncidente {
  id: string;
  timestamp: Date;
  tipo: TipoEvento;                 // Tipo de hito [cite: 23]
  descripcion?: string;
}