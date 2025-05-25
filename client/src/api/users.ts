import api from './api';
import { User, ApiResponse } from '../types';

interface IUserPagination {
	results: User[];
	limit: number;
	page: number;
	totalPages: number;
	total: number;
}

export const getAllUsers = async (filter: Record<string, any> = {}): Promise<ApiResponse<IUserPagination>> => {
	try {
		const paylaod = {
			page: 1,
			limit: 10,
			sortBy: {
				name: 'createdAt',
				order: 'asc'
			},
			filter
		}
		const response = await api.post('/user/list', paylaod);
		return response.data;
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch users' };
	}
};

export const searchUsers = async (query: string): Promise<ApiResponse<User[]>> => {
	try {
		const response = await api.get('/user/search', { params: { q: query } });
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to search users' };
	}
};