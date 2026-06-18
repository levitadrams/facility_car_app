/**
 * Serviço de Destinos
 * Comunicação com API de destinos e serviços externos
 */

import api from './api';
import { RouteDestination, CreateDestinationPayload, NominatimResult, OsrmRouteResponse, RouteCalculation } from '../types/destination';

/**
 * Fator de correção de tráfego
 * O OSRM calcula tempo baseado em velocidade teórica sem considerar:
 * - Trânsito em tempo real
 * - Semáforos e cruzamentos  
 * - Congestionamentos
 * - Condições reais da via
 * 
 * Este fator aproxima o tempo da realidade urbana.
 * 
 * Ajustado para 1.65 após calibração com rotas reais:
 * - Exemplo: 47 min (OSRM) × 1.65 = 77 min (próximo de 78 min Google Maps)
 * - 1.65 = adiciona 65% ao tempo calculado
 * 
 * Para áreas diferentes, ajuste conforme necessário:
 * - Rodovias: 1.10-1.20
 * - Subúrbio: 1.40-1.50
 * - Urbano: 1.60-1.70
 * - Metrópole: 1.70-1.80
 */
const TRAFFIC_FACTOR = 1.65;

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
  
  if (!response.ok) {
    throw new Error(`OSRM error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Garante que a estrutura esperada existe
  if (!data || !data.code || !Array.isArray(data.routes)) {
    throw new Error('Resposta inválida do OSRM');
  }
  
  return data;
}

/**
 * Calcula rota com estimativa de tempo realista
 * Aplica fator de correção de tráfego ao tempo do OSRM
 */
export async function calculateRouteWithEstimate(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number
): Promise<RouteCalculation | null> {
  try {
    const response = await calculateRoute(originLat, originLon, destLat, destLon);
    
    // Validação robusta da resposta
    if (!response || response.code !== 'Ok' || !Array.isArray(response.routes) || response.routes.length === 0) {
      return null;
    }

    const route = response.routes[0];
    
    // Validação dos campos obrigatórios
    if (typeof route.distance !== 'number' || typeof route.duration !== 'number') {
      return null;
    }

    const durationCalculated = route.duration; // Tempo teórico do OSRM
    const durationEstimated = durationCalculated * TRAFFIC_FACTOR; // Tempo estimado

    return {
      distance: route.distance,
      durationCalculated,
      durationEstimated,
      trafficFactor: TRAFFIC_FACTOR,
    };
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    return null;
  }
}
