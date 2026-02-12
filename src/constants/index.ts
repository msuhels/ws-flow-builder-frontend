/**
 * Application constants
 */

export const APP_NAME = 'Trae Project';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FLOWS: '/flows',
  FLOW_EDIT: '/flows/:id/edit',
  CONTACTS: '/contacts',
  CONTACT_DETAIL: '/contacts/:id',
  SETTINGS: '/settings',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  DASHBOARD: '/dashboard',
  FLOWS: '/flows',
  CONTACTS: '/contacts',
  MESSAGES: '/messages',
  SETTINGS: '/settings',
  WEBHOOKS: '/webhooks',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
