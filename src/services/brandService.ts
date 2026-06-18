import api from './api';
import { BrandListResponse } from '../types/brand';

export async function searchBrands(query: string): Promise<BrandListResponse> {
  const response = await api.get('/brands', { params: { search: query, per_page: 15 } });
  return response.data;
}

export async function getBrands(page: number = 1): Promise<BrandListResponse> {
  const response = await api.get('/brands', { params: { page, per_page: 15 } });
  return response.data;
}
