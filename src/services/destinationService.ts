/**
 * Serviço de Destinos
 * Comunicação com API de destinos e serviços externos
 */

import api from './api';
import { RouteDestination, CreateDestinationPayload, NominatimResult, OsrmRouteResponse } from '../types/destination';

/**
 * Busca todos os destinos do usuário
 */
export async function getDestinations(): Promise<RouteDestination[]> {
  const response = await api.get('/destinations');
  return response.data;
}

/**
 * Cria um novo destino
 */
export async function createDestination(payload: CreateDestinationPayload): Promise<RouteDestination> {
  const response = await api.post('/destinations', payload);
  return response.data;
}

/**
 * Atualiza um destino existente
 */
export async function updateDestination(id: number, payload: CreateDestinationPayload): Promise<RouteDestination> {
  const response = await api.put(`/destinations/${id}`, payload);
  return response.data;
}

/**
 * Remove (desativa) um destino
 */
export async function deleteDestination(id: number): Promise<void> {
  await api.delete(`/destinations/${id}`);
}

/**
 * Busca locais via Nominatim (OpenStreetMap)
 */
export async function searchPlaces(query: string): Promise<NominatimResult[]> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`,
    {
      headers: {
        'User-Agent': 'FacilityCarApp/1.0',
        'Accept-Language': 'pt-BR',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Nominatim error: ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Resposta inválida do Nominatim');
  }

  return data;
}

/**
 * Calcula distância e tempo via OSRM
 */
export async function calculateRoute(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number
): Promise<OsrmRouteResponse> {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${destLon},${destLat}?overview=false`
  );
  return response.json();
}
