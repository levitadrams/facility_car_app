import api from './api';
import { FipeYear } from '../types/fipeYear';

export async function getYearsByModel(brandId: number, modelId: number): Promise<FipeYear[]> {
  const response = await api.get(`/brands/${brandId}/models/${modelId}/years`);
  return response.data.data;
}
