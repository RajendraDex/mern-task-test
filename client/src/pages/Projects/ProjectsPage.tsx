import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ProjectList from '../../components/projects/ProjectList';
import ProjectForm from '../../components/projects/ProjectForm';
import { getProjects, createProject, deleteProject } from '../../api/projects';
import { Project } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ProjectsPage: React.FC = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		setLoading(true);
		const { data, error } = await getProjects();
		if (data) {
			setProjects(data);
		} else {
			console.error(error);
		}
		setLoading(false);
	};

	const handleCreateProject = async (project: Partial<Project>) => {
		const { data, error } = await createProject(project);
		if (data) {
			setProjects([...projects, data]);
			setShowForm(false);
		} else {
			console.error(error);
		}
	};

	const handleDeleteProject = async (projectId: string) => {
		const { error } = await deleteProject(projectId);
		if (!error) {
			setProjects(projects.filter((project) => project._id !== projectId));
		} else {
			console.error(error);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4">Projects</Typography>
				{user && (
					<Button
						variant="contained"
						color="primary"
						onClick={() => setShowForm(true)}
					>
						Create Project
					</Button>
				)}
			</Box>

			{showForm ? (
				<ProjectForm
					onSubmit={handleCreateProject}
					onCancel={() => setShowForm(false)}
				/>
			) : loading ? (
				<Typography>Loading projects...</Typography>
			) : (
				<ProjectList projects={projects} onDelete={handleDeleteProject} />
			)}
		</Box>
	);
};

export default ProjectsPage;