/**
 * API service - centralized API calls
 */

import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import type { 
  AuthResponse, 
  ApiResponse, 
  Flow, 
  Contact, 
  Message, 
  Settings 
} from '@/types';

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
    return response.data;
  },

  register: async (username: string, password: string, email?: string): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, { username, password, email });
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getData: async (): Promise<ApiResponse> => {
    const response = await api.get(API_ENDPOINTS.DASHBOARD);
    return response.data;
  },
};

// Flows API
export const flowsApi = {
  getAll: async (): Promise<ApiResponse<Flow[]>> => {
    const response = await api.get(API_ENDPOINTS.FLOWS);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Flow>> => {
    const response = await api.get(`${API_ENDPOINTS.FLOWS}/${id}`);
    return response.data;
  },

  create: async (flow: Partial<Flow>): Promise<ApiResponse<Flow>> => {
    const response = await api.post(API_ENDPOINTS.FLOWS, flow);
    return response.data;
  },

  update: async (id: string, flow: Partial<Flow>): Promise<ApiResponse<Flow>> => {
    const response = await api.put(`${API_ENDPOINTS.FLOWS}/${id}`, flow);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`${API_ENDPOINTS.FLOWS}/${id}`);
    return response.data;
  },
};

// Contacts API
export const contactsApi = {
  getAll: async (): Promise<ApiResponse<Contact[]>> => {
    const response = await api.get(API_ENDPOINTS.CONTACTS);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Contact>> => {
    const response = await api.get(`${API_ENDPOINTS.CONTACTS}/${id}`);
    return response.data;
  },

  create: async (contact: Partial<Contact>): Promise<ApiResponse<Contact>> => {
    const response = await api.post(API_ENDPOINTS.CONTACTS, contact);
    return response.data;
  },

  update: async (id: string, contact: Partial<Contact>): Promise<ApiResponse<Contact>> => {
    const response = await api.put(`${API_ENDPOINTS.CONTACTS}/${id}`, contact);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`${API_ENDPOINTS.CONTACTS}/${id}`);
    return response.data;
  },
};

// Messages API
export const messagesApi = {
  send: async (message: Partial<Message>): Promise<ApiResponse<Message>> => {
    const response = await api.post(API_ENDPOINTS.MESSAGES, message);
    return response.data;
  },

  getByContact: async (contactId: string): Promise<ApiResponse<Message[]>> => {
    const response = await api.get(`${API_ENDPOINTS.MESSAGES}?contact_id=${contactId}`);
    return response.data;
  },
};

// Settings API
export const settingsApi = {
  get: async (): Promise<ApiResponse<Settings>> => {
    const response = await api.get(API_ENDPOINTS.SETTINGS);
    return response.data;
  },

  update: async (settings: Partial<Settings>): Promise<ApiResponse<Settings>> => {
    const response = await api.put(API_ENDPOINTS.SETTINGS, settings);
    return response.data;
  },
};
