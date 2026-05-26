import { TipoEmergencia, Carro } from "../types/models";
import { httpClient } from "./httpClient";

export interface EmergenciasData {
  ids: string[];
  texts: string[];
  dates: string[];
}

export interface WeatherData {
  icon?: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_dir: string;
  precipitation: number;
  FWI: number | string;
  FWI_score: string;
  source?: string;
  updated_at?: string;
}

export const obtenerEmergenciasActivas = async (): Promise<EmergenciasData> => {
  const response = await httpClient.get<EmergenciasData>("/emergenciasActivas");
  return response.data;
};

export const obtenerHistorialEmergencias = async (): Promise<any[]> => {
  const response = await httpClient.get<any[]>("/emergenciasHistorial");
  return response.data;
};

export const obtenerDatosClimaticos = async (): Promise<WeatherData> => {
  const response = await httpClient.get<WeatherData>("/api/fire-risk");
  return response.data;
};

export const descargarReporteHistorial = async (
  formato: "xlsx" | "pdf"
): Promise<void> => {
  const response = await httpClient.get<Blob>(
    `/reportes/emergenciasHistorial.${formato}`,
    {
      responseType: "blob",
    }
  );

  const fileName = `historial_emergencias.${formato}`;
  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Automatizacion operativa [cite: 33]
export const generarDespachoPreliminar = (
  tipo: TipoEmergencia,
  carrosDisponibles: Carro[]
) => {
  const sugerencia = carrosDisponibles
    .filter((c) => c.estado === "DISPONIBLE_CUARTEL")
    .slice(0, tipo.carrosRequeridos);

  return {
    unidades: sugerencia,
    morse: tipo.codigoMorse,
    notificacion: `Emergencia tipo: ${tipo.nombre}. Unidades: ${sugerencia
      .map((u) => u.nombre)
      .join(", ")}`,
  };
};

export const enviarNotificacionTelegram = async (mensaje: string) => {
  const response = await httpClient.post("/telegram/send", {
    mensaje,
  });

  return response.data;
};
