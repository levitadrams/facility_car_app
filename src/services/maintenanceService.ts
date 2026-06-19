/**
 * Serviço de Manutenções
 * Comunicação com a API de manutenções
 */

import api from './api';
import { Maintenance, MaintenancePayload, MaintenanceListResponse } from '../types/maintenance';

export interface MaintenanceFilters {
  vehicle_id?: number;
  maintenance_type_id?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Busca todas as manutenções do usuário com paginação, busca e filtros
 */
export async function getMaintenances(
  page: number = 1,
  filters?: MaintenanceFilters
): Promise<MaintenanceListResponse> {
  const params: Record<string, string | number> = { page };
  if (filters?.vehicle_id) params.vehicle_id = filters.vehicle_id;
  if (filters?.maintenance_type_id) params.maintenance_type_id = filters.maintenance_type_id;
  if (filters?.start_date) params.start_date = filters.start_date;
  if (filters?.end_date) params.end_date = filters.end_date;

  const response = await api.get('/maintenances', { params });
  return response.data;
}

/**
 * Busca uma manutenção específica
 */
export async function getMaintenance(id: number): Promise<Maintenance> {
  const response = await api.get(`/maintenances/${id}`);
  return response.data.data;
}

/**
 * Cria uma nova manutenção
 */
export async function createMaintenance(payload: MaintenancePayload): Promise<Maintenance> {
  const response = await api.post('/maintenances', payload);
  return response.data.data;
}

/**
 * Atualiza uma manutenção existente
 */
export async function updateMaintenance(id: number, payload: MaintenancePayload): Promise<Maintenance> {
  const response = await api.put(`/maintenances/${id}`, payload);
  return response.data.data;
}

/**
 * Remove uma manutenção
 */
export async function deleteMaintenance(id: number): Promise<void> {
  await api.delete(`/maintenances/${id}`);
}
