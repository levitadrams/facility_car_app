import api from './api';
import { VehicleModelListResponse } from '../types/vehicleModel';

export async function searchModels(brandId: number, query: string): Promise<VehicleModelListResponse> {
  const response = await api.get(`/brands/${brandId}/models`, { params: { search: query, per_page: 15 } });
  return response.data;
}

export async function getModelsByBrand(brandId: number, page: number = 1): Promise<VehicleModelListResponse> {
  const response = await api.get(`/brands/${brandId}/models`, { params: { page, per_page: 15 } });
  return response.data;
}
