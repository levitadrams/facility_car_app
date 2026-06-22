/**
 * Serviço de Mapa de Rotas (RotasGo)
 *
 * Comunicação com API de rotas detalhadas (com geometria completa)
 */

import api from './api';
import { RouteResponse, RouteMapData } from '../types/route';

/**
 * Busca rota detalhada entre localização atual e destino
 *
 * @param destinationId   ID do destino cadastrado
 * @param latitude        Latitude da origem (localização atual)
 * @param longitude       Longitude da origem (localização atual)
 * @returns Promise<RouteMapData>
 */
export async function getRoute(
  destinationId: number,
  latitude: number,
  longitude: number
): Promise<RouteMapData> {
  const response = await api.get<RouteResponse>(
    `/destinations/${destinationId}/route`,
    {
      params: {
        latitude,
        longitude,
      },
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro ao calcular rota');
  }

  return response.data.data;
}
