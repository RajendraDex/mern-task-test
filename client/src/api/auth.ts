import api from './api';
import { User, ApiResponse } from '../types';

interface ITokenResponse {
	access: {
		token: string;
		expires: string;
	},
	refresh: {
		token: string;
		expires: string;
	},
}

export const register = async (username: string, email: string, password: string): Promise<ApiResponse<User>> => {
	try {
		const response = await api.post('/auth/register', { username, email, password });
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Registration failed' };
	}
};

export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: ITokenResponse }>> => {
	try {
		const response = await api.post('/auth/login', { email, password });
		return response.data;
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Login failed' };
	}
};
export const logout = async (): Promise<ApiResponse<{ status: number }>> => {
	try {
		const response = await api.post('/auth/logout');

		console.log("🚀 ---------- auth.ts:36 ---------- logout ---------- response:", response);

		return response;
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Logout failed' };
	}
};

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
	try {
		const response = await api.get('/auth/me');
		return response.data;
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch user' };
	}
};