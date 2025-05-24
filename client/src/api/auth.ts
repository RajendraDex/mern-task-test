import api from './api';
import { User, ApiResponse } from '../types';

export const register = async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
	try {
		const response = await api.post('/auth/register', { name, email, password });
		return { data: response.data.user };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Registration failed' };
	}
};

export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
	try {
		const response = await api.post('/auth/login', { email, password });
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Login failed' };
	}
};

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
	try {
		const response = await api.get('/auth/me');
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch user' };
	}
};