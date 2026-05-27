const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const reporteUrl = (path: string): string => `${API_BASE_URL}${path}`;

export const abrirReporte = (path: string): void => {
  window.open(reporteUrl(path), "_blank", "noopener,noreferrer");
};
