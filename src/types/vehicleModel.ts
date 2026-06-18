export interface VehicleModel {
  id: number;
  brand_id: number;
  name: string;
  fipe_code?: string;
}

export interface VehicleModelListResponse {
  data: VehicleModel[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
