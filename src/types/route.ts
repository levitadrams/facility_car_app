/**
 * Tipos relacionados a RotasGo / Mapa de Rotas
 */

export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface RouteOrigin {
  latitude: number;
  longitude: number;
  label: string;
}

export interface RouteDestination {
  latitude: number;
  longitude: number;
  name: string;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  type: string;
  modifier: string;
  geometry: RouteCoordinate[];
}

/**
 * Resposta da API de rota detalhada
 */
export interface RouteResponse {
  success: boolean;
  data: RouteMapData;
  message?: string;
}

export interface RouteMapData {
  distance_km: number;
  duration_minutes: number;
  distance_raw: number;
  duration_raw: number;
  traffic_factor: number;
  origin: RouteOrigin;
  destination: RouteDestination;
  geometry: RouteCoordinate[];
  steps: RouteStep[];
  instructions: string[];
}

/**
 * Parâmetros para navegação para a tela de mapa
 */
export interface RouteMapParams {
  destinationId: number;
  destinationName: string;
  destinationLatitude: number;
  destinationLongitude: number;
}
