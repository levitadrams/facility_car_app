/**
 * Tipos relacionados a Manutenções
 */

import { Vehicle } from './vehicle';

export interface MaintenanceCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  active?: boolean;
  types?: MaintenanceType[];
}

export interface MaintenanceType {
  id: number;
  maintenance_category_id: number;
  name: string;
  description?: string;
  recommended_interval_km?: number;
  recommended_interval_months?: number;
  active?: boolean;
  category?: MaintenanceCategory;
}

export interface MaintenanceVehicleInfo {
  id: number;
  nickname?: string;
  plate?: string;
  brand?: { id: number; name: string } | null;
  model?: { id: number; name: string } | null;
}

export interface MaintenanceTypeInfo {
  id: number;
  name: string;
  category?: {
    id: number;
    name: string;
    color?: string;
  } | null;
}

export interface Maintenance {
  id: number;
  vehicle?: MaintenanceVehicleInfo;
  vehicle_id?: number;
  maintenance_type_id: number;
  maintenance_type?: MaintenanceTypeInfo;
  description?: string;
  performed_at: string;
  current_mileage: number;
  cost: number;
  workshop_name?: string;
  invoice_number?: string;
  notes?: string;
  next_maintenance_mileage?: number;
  next_maintenance_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaintenancePayload {
  vehicle_id: number;
  maintenance_type_id: number;
  description?: string;
  performed_at: string;
  current_mileage: number;
  cost: number;
  workshop_name?: string;
  invoice_number?: string;
  notes?: string;
  next_maintenance_mileage?: number;
  next_maintenance_date?: string;
}

export interface MaintenanceListResponse {
  data: Maintenance[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export type MaintenanceSort = 'recent' | 'oldest';
