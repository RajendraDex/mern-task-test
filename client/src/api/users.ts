import api from './api';
import { User, ApiResponse } from '../types';

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
	try {
		const response = await api.get('/users');
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch users' };
	}
};

export const searchUsers = async (query: string): Promise<ApiResponse<User[]>> => {
	try {
		const response = await api.get('/users/search', { params: { q: query } });
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to search users' };
	}
};