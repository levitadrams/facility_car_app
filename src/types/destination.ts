/**
 * Tipos relacionados a destinos/rotas
 */

export interface RouteDestination {
  id: number;
  user_id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  notes?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDestinationPayload {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
}

export interface OsrmRouteResponse {
  code: string;
  routes: Array<{
    distance: number;
    duration: number;
  }>;
}

export interface RouteCalculation {
  distance: number;
  durationCalculated: number;  // Tempo teórico do OSRM (sem fator)
  durationEstimated: number;   // Tempo estimado (com fator de tráfego)
  trafficFactor: number;       // Fator aplicado (ex: 1.35)
}

export interface DestinationWithDistance extends RouteDestination {
  distance?: number;
  duration?: number;
  durationCalculated?: number;  // Tempo calculado pelo OSRM
  durationEstimated?: number;   // Tempo estimado com fator
}
