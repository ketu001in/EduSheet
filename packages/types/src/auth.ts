export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface RegisterData {
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface ForgotPasswordData {
  email?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
