/**
 * Serviço de Dashboard
 * Comunicação com a API de estatísticas do dashboard
 */

import api from './api';
import { DashboardStats } from '../types/dashboard';

/**
 * Busca as estatísticas do dashboard do usuário autenticado
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get('/dashboard');
  return response.data.data;
}
