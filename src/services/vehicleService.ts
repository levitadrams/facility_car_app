/**
 * Serviço de Veículos
 * Comunicação com a API de veículos
 */

import api from './api';
import { Vehicle, VehiclePayload, VehicleListResponse, VehicleSort } from '../types/vehicle';

/**
 * Busca todos os veículos do usuário com paginação, busca e ordenação
 */
export async function getVehicles(
  page: number = 1,
  search?: string,
  sort: VehicleSort = 'recent'
): Promise<VehicleListResponse> {
  const params: Record<string, string | number> = { page, sort };
  if (search) params.search = search;

  const response = await api.get('/vehicles', { params });
  return response.data;
}

/**
 * Busca um veículo específico
 */
export async function getVehicle(id: number): Promise<Vehicle> {
  const response = await api.get(`/vehicles/${id}`);
  return response.data.data;
}

/**
 * Cria um novo veículo
 */
export async function createVehicle(payload: VehiclePayload): Promise<Vehicle> {
  const response = await api.post('/vehicles', payload);
  return response.data.data;
}

/**
 * Atualiza um veículo existente
 */
export async function updateVehicle(id: number, payload: VehiclePayload): Promise<Vehicle> {
  const response = await api.put(`/vehicles/${id}`, payload);
  return response.data.data;
}

/**
 * Remove um veículo
 */
export async function deleteVehicle(id: number): Promise<void> {
  await api.delete(`/vehicles/${id}`);
}
