import api from './api';
import { Task, TaskFormValues, ApiResponse, TaskStatus } from '../types';

interface ITaskPagination {
	results: Task[];
	limit: number;
	page: number;
	totalPages: number;
	total: number;
}

export const getTasksByProject = async (projectId: string): Promise<ApiResponse<Task[]>> => {
	try {
		const response = await api.get(`/task/project/${projectId}`);
		return { data: response.data?.tasks };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch tasks' };
	}
};
export const getTasksByProjectId = async (projectId: string, filter: Record<string, any>): Promise<ApiResponse<ITaskPagination>> => {
	try {
		const paylaod = {
			page: 1,
			limit: 10,
			sortBy: {
				name: 'createdAt',
				order: 'asc'
			},
			filter: {
				projectId: projectId,
				...filter
			}
		}
		const response = await api.post(`/task/list`, paylaod);
		return { data: response.data?.tasks };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch tasks' };
	}
};

export const getTaskById = async (id: string): Promise<ApiResponse<Task>> => {
	try {
		const response = await api.get(`/tasks/${id}`);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch task' };
	}
};

export const createTask = async (task: TaskFormValues): Promise<ApiResponse<Task>> => {
	try {
		const response = await api.post(`task/create`, task);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to create task' };
	}
};

export const updateTask = async (
	id: string,
	task: Partial<TaskFormValues>
): Promise<ApiResponse<Task>> => {
	try {
		const response = await api.put(`/tasks/${id}`, task);
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to update task' };
	}
};

export const deleteTask = async (id: string): Promise<ApiResponse<void>> => {
	try {
		await api.delete(`/tasks/${id}`);
		return { message: 'Task deleted successfully' };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to delete task' };
	}
};

export const updateTaskStatus = async (
	id: string,
	status: TaskStatus
): Promise<ApiResponse<Task>> => {
	try {
		const response = await api.patch(`/tasks/${id}/status`, { status });
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to update task status' };
	}
};