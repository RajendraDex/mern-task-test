import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip, Divider, Stack } from '@mui/material';
import ProjectForm from '../../components/projects/ProjectForm';
import { getProjectById, updateProject, deleteProject } from '../../api/projects';
import { Project, TeamMember, User } from '../../types';
import { useAuth } from '../../context/AuthContext';


import TeamMemberList from '../../components/team/TeamMemberList';
import AddTeamMemberForm from '../../components/team/AddTeamMemberForm';
import { getTeamMembers, addTeamMember, removeTeamMember, updateTeamMemberRole } from '../../api/team';
import { getAllUsers } from '../../api/users';

const ProjectDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);

	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [availableUsers, setAvailableUsers] = useState<User[]>([]);
	const [showAddMemberForm, setShowAddMemberForm] = useState(false);

	useEffect(() => {
		const fetchProject = async () => {
			if (!id) return;
			setLoading(true);
			const { data, error } = await getProjectById(id);
			if (data) {
				setProject(data);
			} else {
				console.error(error);
				navigate('/projects');
			}
			setLoading(false);
		};

		fetchProject();
	}, [id, navigate]);

	useEffect(() => {
		const fetchTeamMembers = async () => {
			if (!id) return;
			const { data } = await getTeamMembers(id);
			if (data) {
				setTeamMembers(data);
			}
		};

		fetchTeamMembers();
	}, [id]);

	// Add this effect to fetch available users
	useEffect(() => {
		const fetchAvailableUsers = async () => {
			const { data } = await getAllUsers();
			if (data) {
				setAvailableUsers(data.results);
			}
		};

		fetchAvailableUsers();
	}, []);

	// Add these handlers
	const handleAddTeamMember = async (userId: string, role: 'admin' | 'member') => {
		if (!id) return;
		const { data } = await addTeamMember({ projectId: id, userId, role });
		if (data) {
			setTeamMembers([...teamMembers, data]);
			setShowAddMemberForm(false);
		}
	};

	const handleRemoveTeamMember = async (userId: string) => {
		if (!id) return;
		const { error } = await removeTeamMember({ projectId: id, members: [userId], userId });
		if (!error) {
			setTeamMembers(teamMembers.filter(member => member._id !== userId));
		}
	};

	const handleRoleChange = async (userId: string, newRole: 'admin' | 'member') => {
		if (!id) return;
		const { data } = await updateTeamMemberRole(id, userId, newRole);
		if (data) {
			setTeamMembers(teamMembers.map(member =>
				member._id === userId ? { ...member, role: newRole } : member
			));
		}
	};

	const handleUpdateProject = async (updatedProject: Partial<Project>) => {
		if (!id) return;
		const { data, error } = await updateProject(id, updatedProject);
		if (data) {
			setProject(data);
			setEditing(false);
		} else {
			console.error(error);
		}
	};

	const handleDeleteProject = async () => {
		if (!id) return;
		const { error } = await deleteProject(id);
		if (!error) {
			navigate('/projects');
		} else {
			console.error(error);
		}
	};

	if (loading) {
		return <Typography>Loading project details...</Typography>;
	}

	if (!project) {
		return <Typography>Project not found</Typography>;
	}

	const isOwner = user?._id === project.owner._id;

	return (
		<>
			<Box sx={{ p: 3 }}>
				{editing ? (
					<ProjectForm
						initialValues={project}
						onSubmit={handleUpdateProject}
						onCancel={() => setEditing(false)}
					/>
				) : (
					<>
						<Box display="flex" justifyContent="space-between" alignItems="center">
							<Typography variant="h4">{project.name}</Typography>
							{isOwner && (
								<Box>
									<Button
										variant="outlined"
										sx={{ mr: 1 }}
										onClick={() => setEditing(true)}
									>
										Edit
									</Button>
									<Button
										variant="outlined"
										color="error"
										onClick={handleDeleteProject}
									>
										Delete
									</Button>
								</Box>
							)}
						</Box>
						{
							isOwner && (
								<>
									<Button
										variant="contained"
										sx={{ mt: 2 }}
										onClick={() => setShowAddMemberForm(true)}
									>
										Add Team Member
									</Button>
									<AddTeamMemberForm
										open={showAddMemberForm}
										onClose={() => setShowAddMemberForm(false)}
										onSubmit={handleAddTeamMember}
										availableUsers={availableUsers}
										existingMembers={teamMembers}
									/>
								</>
							)
						}

						<Typography variant="subtitle1" color="text.secondary" mt={1}>
							Owned by: {project.owner.username}
						</Typography>

						<Divider sx={{ my: 3 }} />

						<Typography variant="body1" paragraph>
							{project.description}
						</Typography>

						{/* <Box mt={3}>
							<Typography variant="h6">Team Members</Typography>
							<Stack direction="row" spacing={1} mt={1}>
								{project?.teamMembers?.length > 0 && project.teamMembers.map((member) => (
									<Chip key={member._id} label={member.username} />
								))}
							</Stack>
							</Box> */}
						<TeamMemberList
							members={teamMembers}
							currentUserId={user?._id || ''}
							isOwner={isOwner}
							onRoleChange={handleRoleChange}
							onRemove={handleRemoveTeamMember}
						/>
					</>
				)}
			</Box>

		</>
	);
};

export default ProjectDetailPage;
