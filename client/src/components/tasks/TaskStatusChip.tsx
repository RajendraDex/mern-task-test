import React from 'react';
import { Chip } from '@mui/material';
import { TaskStatus } from '../../types';

interface TaskStatusChipProps {
	status: TaskStatus;
}

const statusColors = {
	todo: 'default',
	'in-progress': 'primary',
	completed: 'success',
};

const statusLabels = {
	todo: 'To Do',
	'in-progress': 'In Progress',
	completed: 'Completed',
};

const TaskStatusChip: React.FC<TaskStatusChipProps> = ({ status }) => {
	return (
		<Chip
			label={statusLabels[status]}
			// color={statusColors[status]}
			size="small"
		/>
	);
};

export default TaskStatusChip;