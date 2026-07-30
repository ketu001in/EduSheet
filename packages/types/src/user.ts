import { UserRole } from './auth';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  phone?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  board_id?: string;
  class_id?: string;
  school_name?: string;
  preferred_language?: string;
  parent_name?: string;
  country?: string;
  state?: string;
  city?: string;
  mobile?: string;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
}
