/**
 * Common type definitions
 */

export interface User {
  id?: string;
  username: string;
  email?: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  edges: any[];
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  contact_id: string;
  content: string;
  type: 'incoming' | 'outgoing';
  status?: string;
  created_at?: string;
}

export interface Settings {
  id?: string;
  webhook_url?: string;
  api_key?: string;
  notifications_enabled?: boolean;
  [key: string]: any;
}
