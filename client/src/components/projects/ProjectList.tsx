import React from 'react';
import { Project } from '../../types';
import { Box, Card, CardContent, Typography, Chip, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

interface ProjectListProps {
	projects: Project[];
	onDelete: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onDelete }) => {
	return (
		<Box sx={{ mt: 3 }}>
			{projects.length === 0 ? (
				<Typography variant="body1">No projects found</Typography>
			) : (
				<Stack spacing={2}>
					{projects.map((project) => (
						<Card key={project._id} elevation={3}>
							<CardContent>
								<Box display="flex" justifyContent="space-between">
									<Typography variant="h6" component="div">
										{project.name}
									</Typography>
									<Chip label={project.owner.name} size="small" />
								</Box>
								<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
									{project.description}
								</Typography>
								<Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
									<Typography variant="caption">
										Created: {formatDate(project.createdAt)}
									</Typography>
									<Box>

										<Button
											component={Link}
											to={`/projects/${project._id}/tasks`}
											variant="outlined"
											sx={{ mr: 1 }}
										>
											View Tasks
										</Button>
										<Button
											component={Link}
											to={`/projects/${project._id}`}
											size="small"
											variant="outlined"
											sx={{ mr: 1 }}
										>
											View
										</Button>
										<Button
											size="small"
											variant="outlined"
											color="error"
											onClick={() => onDelete(project._id)}
										>
											Delete
										</Button>
									</Box>
								</Box>
							</CardContent>
						</Card>
					))}
				</Stack>
			)}
		</Box>
	);
};

export default ProjectList;