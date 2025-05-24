import React from 'react';
import { Chip } from '@mui/material';
import { TaskPriority } from '../../types';

interface TaskPriorityChipProps {
	priority: TaskPriority;
}

const priorityColors = {
	low: 'success',
	medium: 'warning',
	high: 'error',
};

const TaskPriorityChip: React.FC<TaskPriorityChipProps> = ({ priority }) => {
	return (
		<Chip
			label={priority.toUpperCase()}
			// color={priorityColors[priority]}
			size="small"
		/>
	);
};

export default TaskPriorityChip;