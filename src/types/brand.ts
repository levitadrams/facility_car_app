export interface Brand {
  id: number;
  name: string;
  fipe_code?: string;
}

export interface BrandListResponse {
  data: Brand[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
