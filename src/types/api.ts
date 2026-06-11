/**
 * Tipos relacionados às respostas da API
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}
