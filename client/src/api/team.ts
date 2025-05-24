import api from './api';
import { TeamMember, AddTeamMemberRequest, RemoveTeamMemberRequest, ApiResponse } from '../types';

export const getTeamMembers = async (projectId: string): Promise<ApiResponse<TeamMember[]>> => {
	try {
		const response = await api.get(`/project/get-project-team/${projectId}`);
		return { data: response.data?.members };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to fetch team members' };
	}
};

export const addTeamMember = async (
	request: AddTeamMemberRequest
): Promise<ApiResponse<TeamMember>> => {
	try {
		const response = await api.post(`/project/add-project-member/${request.projectId}`, {
			userId: request.userId,
			role: request.role,
		});
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to add team member' };
	}
};

export const removeTeamMember = async (
	request: RemoveTeamMemberRequest
): Promise<ApiResponse<void>> => {
	try {
		await api.post(`/project/remove-project-member/${request.projectId}`, request.members);
		return { message: 'Team member removed successfully' };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to remove team member' };
	}
};

export const updateTeamMemberRole = async (
	projectId: string,
	userId: string,
	role: 'admin' | 'member'
): Promise<ApiResponse<TeamMember>> => {
	try {
		const response = await api.patch(`/projects/${projectId}/team/${userId}/role`, { role });
		return { data: response.data };
	} catch (error: any) {
		return { error: error.response?.data?.message || 'Failed to update team member role' };
	}
};