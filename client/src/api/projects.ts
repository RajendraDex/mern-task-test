import api from './api';
import { Project, ApiResponse } from '../types';

export const getProjects = async (): Promise<ApiResponse<Project[]>> => {
	try {
		const response = await api.get('/projects');
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch projects' };
	}
};

export const getProjectById = async (id: string): Promise<ApiResponse<Project>> => {
	try {
		const response = await api.get(`/projects/${id}`);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch project' };
	}
};

export const createProject = async (project: Partial<Project>): Promise<ApiResponse<Project>> => {
	try {
		const response = await api.post('/projects', project);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to create project' };
	}
};

export const updateProject = async (
	id: string,
	project: Partial<Project>
): Promise<ApiResponse<Project>> => {
	try {
		const response = await api.put(`/projects/${id}`, project);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to update project' };
	}
};

export const deleteProject = async (id: string): Promise<ApiResponse<void>> => {
	try {
		await api.delete(`/projects/${id}`);
		return { message: 'Project deleted successfully' };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to delete project' };
	}
};