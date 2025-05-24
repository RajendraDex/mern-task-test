import api from './api';
import { DashboardStats, UserTaskStats, ProjectProgress, ApiResponse } from '../types';

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
	try {
		const response = await api.get('/main/stats');
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch dashboard stats' };
	}
};

export const getUserTaskStats = async (): Promise<ApiResponse<UserTaskStats[]>> => {
	try {
		const response = await api.get('/main/user-stats');
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch user task stats' };
	}
};

export const getProjectProgress = async (): Promise<ApiResponse<ProjectProgress[]>> => {
	try {
		const response = await api.get('/main/project-progress');
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch project progress' };
	}
};