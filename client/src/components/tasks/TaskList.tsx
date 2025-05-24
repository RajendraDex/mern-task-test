import React from 'react';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';
import { Box, Typography } from '@mui/material';
import { updateTaskStatus } from '../../api/tasks';

interface TaskListProps {
	tasks: Task[];
	onDelete: (taskId: string) => void;
	onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onStatusChange }) => {
	const handleStatusChange = async (taskId: string, status: TaskStatus) => {
		if (onStatusChange) {
			await onStatusChange(taskId, status);
		}
	};

	return (
		<Box>
			{tasks.length === 0 ? (
				<Typography>No tasks found</Typography>
			) : (
				tasks.map((task) => (
					<TaskCard
						key={task._id}
						task={task}
						onDelete={() => onDelete(task._id)}
						onStatusChange={(status) => handleStatusChange(task._id, status)}
					/>
				))
			)}
		</Box>
	);
};

export default TaskList;