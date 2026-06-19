/**
 * Serviço de Categorias e Tipos de Manutenção
 */

import api from './api';
import { MaintenanceCategory, MaintenanceType } from '../types/maintenance';

export async function getMaintenanceCategories(): Promise<MaintenanceCategory[]> {
  const response = await api.get('/maintenance-categories');
  return response.data.data;
}

export async function getMaintenanceTypes(): Promise<MaintenanceType[]> {
  const response = await api.get('/maintenance-types');
  return response.data.data;
}

export async function getMaintenanceTypesByCategory(categoryId: number): Promise<MaintenanceType[]> {
  const response = await api.get(`/maintenance-categories/${categoryId}/types`);
  return response.data.data;
}
