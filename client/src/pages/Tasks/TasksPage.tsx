import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import TaskForm from '../../components/tasks/TaskForm';
import TaskList from '../../components/tasks/TaskList';
import { getTasksByProject, createTask, deleteTask } from '../../api/tasks';
import { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';

const TasksPage: React.FC = () => {
	const { projectId } = useParams<{ projectId: string }>();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		if (projectId) {
			fetchTasks();
		}
	}, [projectId]);

	const fetchTasks = async () => {
		if (!projectId) return;
		setLoading(true);
		const { data, error } = await getTasksByProject(projectId);
		if (data) {
			setTasks(data);
		} else {
			console.error(error);
		}
		setLoading(false);
	};

	const handleCreateTask = async (task: any) => {
		const { data, error } = await createTask(task);
		if (data) {
			setTasks([...tasks, data]);
			setShowForm(false);
		} else {
			console.error(error);
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		const { error } = await deleteTask(taskId);
		if (!error) {
			setTasks(tasks.filter((task) => task._id !== taskId));
		} else {
			console.error(error);
		}
	};

	if (!projectId) {
		return <Typography>Project ID is missing</Typography>;
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4">Tasks</Typography>
				{user && (
					<Button
						variant="contained"
						color="primary"
						onClick={() => setShowForm(true)}
					>
						Create Task
					</Button>
				)}
			</Box>

			{showForm ? (
				<TaskForm
					onSubmit={handleCreateTask}
					onCancel={() => setShowForm(false)}
					projectId={projectId}
					users={[]} // You'll need to fetch project team members here
				/>
			) : loading ? (
				<Typography>Loading tasks...</Typography>
			) : (
				<TaskList
					tasks={tasks}
					onDelete={handleDeleteTask}
					onStatusChange={async (taskId, newStatus) => {
						const { data } = await updateTaskStatus(taskId, newStatus);
						if (data) {
							fetchTasks();
						}
					}}
				/>
			)}
		</Box>
	);
};

export default TasksPage;