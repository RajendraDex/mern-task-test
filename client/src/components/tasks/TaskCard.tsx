import React from 'react';
import { Task, TaskStatus } from '../../types';
import { Card, CardContent, Typography, Chip, Box, Button, Stack } from '@mui/material';
import { formatDate } from '../../utils/dateUtils';
import TaskStatusChip from './TaskStatusChip';
import TaskPriorityChip from './TaskPriorityChip';

interface TaskCardProps {
	task: Task;
	onEdit?: () => void;
	onDelete?: () => void;
	onStatusChange?: (status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
	const assignedUserName = typeof task.assignedTo === 'string' ? '' : task.assignedTo.name;

	return (
		<Card elevation={2} sx={{ mb: 2 }}>
			<CardContent>
				<Box display="flex" justifyContent="space-between" alignItems="flex-start">
					<Typography variant="h6" component="div">
						{task.title}
					</Typography>
					<Stack direction="row" spacing={1}>
						<TaskStatusChip status={task.status} />
						<TaskPriorityChip priority={task.priority} />
					</Stack>
				</Box>

				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					{task.description}
				</Typography>

				<Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
					<Stack direction="row" spacing={1}>
						{assignedUserName && <Chip label={`Assigned to: ${assignedUserName}`} size="small" />}
						{task.dueDate && <Chip label={`Due: ${formatDate(task.dueDate)}`} size="small" />}
					</Stack>

					<Box>
						{onEdit && (
							<Button size="small" onClick={onEdit} sx={{ mr: 1 }}>
								Edit
							</Button>
						)}
						{onDelete && (
							<Button size="small" color="error" onClick={onDelete}>
								Delete
							</Button>
						)}
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default TaskCard;