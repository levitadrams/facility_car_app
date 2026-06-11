/**
 * Tipos relacionados à autenticação
 */

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}
