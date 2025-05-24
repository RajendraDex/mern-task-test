import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip, Divider, Stack } from '@mui/material';
import ProjectForm from '../../components/projects/ProjectForm';
import { getProjectById, updateProject, deleteProject } from '../../api/projects';
import { Project } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ProjectDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);

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
						<Typography variant="h4">{project.title}</Typography>
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

					<Typography variant="subtitle1" color="text.secondary" mt={1}>
						Owned by: {project.owner.name}
					</Typography>

					<Divider sx={{ my: 3 }} />

					<Typography variant="body1" paragraph>
						{project.description}
					</Typography>

					<Box mt={3}>
						<Typography variant="h6">Team Members</Typography>
						<Stack direction="row" spacing={1} mt={1}>
							{project.teamMembers.map((member) => (
								<Chip key={member._id} label={member.name} />
							))}
						</Stack>
					</Box>
				</>
			)}
		</Box>
	);
};

export default ProjectDetailPage;