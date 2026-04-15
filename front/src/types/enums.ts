// Estados operativos de los carros según los requerimientos [cite: 13]
export enum EstadoCarro {
  VERDE = 'DISPONIBLE_CUARTEL',     // Disponible en cuartel [cite: 14]
  AMARILLO = 'TRANSICION',          // No disponible o en transición [cite: 15]
  ROJO = 'ASIGNADO_EMERGENCIA'      // Asignado a una emergencia [cite: 16]
}

// Estados del ciclo de vida de un incidente [cite: 10]
export enum EstadoIncidente {
  DESPACHO = 'DESPACHO_PRELIMINAR',
  EN_CURSO = 'EN_CURSO',
  CERRADO = 'CERRADO'               // Cierre del llamado [cite: 28]
}

// Tipos de eventos para el seguimiento de llamados [cite: 23]
export enum TipoEvento {
  LLEGADA = 'HORA_LLEGADA',         // Registro de hora de llegada [cite: 24]
  MAS_CARROS = 'SOLICITUD_CARROS',   // Solicitud de más carros [cite: 25]
  AMBULANCIA = 'NECESIDAD_AMBULANCIA', // Necesidad de ambulancia [cite: 26]
  APOYO = 'APOYO_INSTITUCIONAL',    // Solicitud de apoyo institucional [cite: 27]
  CIERRE = 'CIERRE_LLAMADO'         // Cierre definitivo [cite: 28]
}