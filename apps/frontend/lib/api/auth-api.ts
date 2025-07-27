import axios from 'axios';
import { sessionManager } from '../auth/session';
import { hashPassword } from '../auth/helpers/password-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterData {
  name: string;
  surname: string;
  dateOfBirth: string;
  email: string;
  password: string;
  phoneNo: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Hash password before sending to backend
    const hashedPassword = hashPassword(data.password);
    const secureData = {
      ...data,
      password: hashedPassword,
    };
    
    const response = await api.post('/auth/register', secureData);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    // Hash password before sending to backend
    const hashedPassword = hashPassword(data.password);
    const secureData = {
      ...data,
      password: hashedPassword,
    };
    
    const response = await api.post('/auth/login', secureData);
    return response.data;
  },

  test: async (): Promise<string> => {
    const response = await api.get('/users/test', {
      headers: {
        Authorization: `Bearer ${sessionManager.getToken()}`,
      },
    });
    return response.data;
  },
};

export default api;