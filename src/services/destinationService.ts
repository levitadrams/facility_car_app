/**
 * Serviço de Destinos
 * Comunicação com API de destinos e serviços externos
 */

import api from './api';
import { RouteDestination, CreateDestinationPayload, NominatimResult, OsrmRouteResponse, RouteCalculation } from '../types/destination';

/**
 * Configurações de fatores de tráfego dinâmicos
 * Ajusta estimativa baseado em horário e distância
 */
const TIME_BASED_FACTORS = {
  dawn: { start: 0, end: 6, factor: 1.15 },          // Madrugada - vias livres
  morningRush: { start: 6, end: 9, factor: 2.00 },  // Pico manhã - trânsito intenso
  daytime: { start: 9, end: 17, factor: 1.50 },     // Dia - moderado
  eveningRush: { start: 17, end: 20, factor: 2.10 }, // Pico tarde - muito intenso
  night: { start: 20, end: 24, factor: 1.30 },      // Noite - moderado/leve
};

const DISTANCE_ADJUSTMENTS = {
  short: { threshold: 5000, multiplier: 1.15 },   // < 5km - mais semáforos
  medium: { threshold: 20000, multiplier: 1.00 }, // 5-20km - balanceado
  long: { threshold: Infinity, multiplier: 0.85 }, // > 20km - mais rodovias
};

const DEFAULT_TRAFFIC_FACTOR = 1.65; // Fallback

/**
 * Calcula fator de tráfego dinâmico baseado em horário e distância
 */
function calculateDynamicTrafficFactor(distance: number): number {
  // 1. Obtém fator base por horário
  const timeFactor = getTimeBasedFactor();

  // 2. Obtém multiplicador por distância
  const distanceMultiplier = getDistanceMultiplier(distance);

  // 3. Calcula fator final
  const finalFactor = timeFactor * distanceMultiplier;

  // 4. Garante limites razoáveis (mínimo 1.1, máximo 2.5)
  return Math.max(1.1, Math.min(2.5, finalFactor));
}

/**
 * Obtém fator de tráfego baseado no horário atual
 */
function getTimeBasedFactor(): number {
  const currentHour = new Date().getHours();

  for (const period of Object.values(TIME_BASED_FACTORS)) {
    if (currentHour >= period.start && currentHour < period.end) {
      return period.factor;
    }
  }

  // Fallback para fator padrão
  return DEFAULT_TRAFFIC_FACTOR;
}

/**
 * Obtém multiplicador baseado na distância da rota
 */
function getDistanceMultiplier(distance: number): number {
  if (distance < DISTANCE_ADJUSTMENTS.short.threshold) {
    return DISTANCE_ADJUSTMENTS.short.multiplier;
  }

  if (distance < DISTANCE_ADJUSTMENTS.medium.threshold) {
    return DISTANCE_ADJUSTMENTS.medium.multiplier;
  }

  return DISTANCE_ADJUSTMENTS.long.multiplier;
}

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
    const trafficFactor = calculateDynamicTrafficFactor(route.distance);
    const durationEstimated = durationCalculated * trafficFactor; // Tempo estimado

    return {
      distance: route.distance,
      durationCalculated,
      durationEstimated,
      trafficFactor,
    };
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    return null;
  }
}
