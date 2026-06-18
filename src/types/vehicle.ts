/**
 * Tipos relacionados a Veículos
 */

export interface VehicleBrand {
  id: number;
  name: string;
}

export interface VehicleModelInfo {
  id: number;
  name: string;
}

export interface Vehicle {
  id: number;
  nickname?: string;
  brand_id: number;
  vehicle_model_id: number;
  brand?: VehicleBrand;
  model?: VehicleModelInfo;
  year: number;
  plate: string;
  color?: string;
  fuel_type?: string;
  current_mileage: number;
  created_at?: string;
  updated_at?: string;
}

export interface VehiclePayload {
  nickname?: string;
  brand_id: number;
  vehicle_model_id: number;
  year: number;
  plate: string;
  color?: string;
  fuel_type?: string;
  current_mileage: number;
}

export interface VehicleListResponse {
  data: Vehicle[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export type VehicleSort = 'recent' | 'oldest' | 'mileage';
