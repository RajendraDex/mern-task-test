import api from './api';
import { Project, ApiResponse } from '../types';

interface IProjectPagination {
	results: Project[];
	limit: number;
	page: number;
	totalPages: number;
	total: number;
}

export const getProjects = async (): Promise<ApiResponse<IProjectPagination>> => {
	try {
		const data = {
			page: 1,
			limit: 10,
			sortBy: {
				name: 'createdAt',
				order: 'asc'
			},
			filter: {
				status: 'active'
			}
		}
		const response = await api.post('/project/list', data);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch projects' };
	}
};

export const getProjectById = async (id: string): Promise<ApiResponse<Project>> => {
	try {
		const response = await api.get(`/project/${id}`);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch project' };
	}
};

export const createProject = async (project: Partial<Project>): Promise<ApiResponse<Project>> => {
	try {
		const response = await api.post('/project/create', project);
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
		const updatePayload = { name: project.name, description: project.description }
		const response = await api.put(`/project/${id}`, updatePayload);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to update project' };
	}
};

export const deleteProject = async (id: string): Promise<ApiResponse<void>> => {
	try {
		await api.delete(`/project/${id}`);
		return { message: 'Project deleted successfully' };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to delete project' };
	}
};