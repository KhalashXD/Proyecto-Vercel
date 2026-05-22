import {TipoEmergencia, Carro } from '../types/models';
import { httpClient } from "./httpClient";


export interface EmergenciasData {
  ids: string[];
  texts: string[];
  dates: string[];
}

export const obtenerEmergenciasActivas = async (): Promise<EmergenciasData> => {
  const response = await httpClient.get<EmergenciasData>("/emergenciasActivas");
  return response.data;
};

// Automatización operativa [cite: 33]
export const generarDespachoPreliminar = (
  tipo: TipoEmergencia, 
  carrosDisponibles: Carro[]
) => {
  // Cálculo automático de carros requeridos [cite: 34]
  const sugerencia = carrosDisponibles
    .filter(c => c.estado === 'DISPONIBLE_CUARTEL') // Restricción de despacho [cite: 18]
    .slice(0, tipo.carrosRequeridos);

  return {
    unidades: sugerencia,
    morse: tipo.codigoMorse,        // Generación según reglas [cite: 37]
    notificacion: `Emergencia tipo: ${tipo.nombre}. Unidades: ${sugerencia.map(u => u.nombre).join(', ')}`
  };
};

// Envío a Telegram mediante API 
export const enviarNotificacionTelegram = async (mensaje: string) => {
  console.log("Enviando a Telegram:", mensaje);
  // Aquí iría la lógica del API de Telegram 
};