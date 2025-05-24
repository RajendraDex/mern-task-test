import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Box,
	TextField,
	Button,
	Stack,
	MenuItem,
	InputLabel,
	FormControl,
	Select,
} from '@mui/material';
import { TaskFormValues, TaskStatus, TaskPriority } from '../../types';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

interface TaskFormProps {
	initialValues?: Partial<TaskFormValues>;
	onSubmit: (values: TaskFormValues) => void;
	onCancel?: () => void;
	projectId: string;
	users: Array<{ _id: string; name: string }>;
}

const TaskForm: React.FC<TaskFormProps> = ({
	initialValues,
	onSubmit,
	onCancel,
	projectId,
	users,
}) => {
	const validationSchema = Yup.object({
		title: Yup.string().required('Title is required'),
		description: Yup.string().required('Description is required'),
		assignedTo: Yup.string().required('Assignee is required'),
		status: Yup.string().required('Status is required'),
		priority: Yup.string().required('Priority is required'),
	});

	const formik = useFormik({
		initialValues: initialValues || {
			title: '',
			description: '',
			assignedTo: '',
			status: 'todo' as TaskStatus,
			priority: 'medium' as TaskPriority,
			dueDate: undefined,
		},
		validationSchema,
		onSubmit: (values) => {
			const taskValues = {
				...values,
				project: projectId,
			};
			onSubmit(taskValues as TaskFormValues);
		},
	});

	return (
		<Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
			<Stack spacing={2}>
				<TextField
					fullWidth
					id="title"
					name="title"
					label="Task Title"
					value={formik.values.title}
					onChange={formik.handleChange}
					error={formik.touched.title && Boolean(formik.errors.title)}
					helperText={formik.touched.title && formik.errors.title}
				/>

				<TextField
					fullWidth
					id="description"
					name="description"
					label="Task Description"
					multiline
					rows={4}
					value={formik.values.description}
					onChange={formik.handleChange}
					error={formik.touched.description && Boolean(formik.errors.description)}
					helperText={formik.touched.description && formik.errors.description}
				/>

				<FormControl fullWidth>
					<InputLabel id="assignedTo-label">Assignee</InputLabel>
					<Select
						labelId="assignedTo-label"
						id="assignedTo"
						name="assignedTo"
						value={formik.values.assignedTo}
						onChange={formik.handleChange}
						label="Assignee"
						error={formik.touched.assignedTo && Boolean(formik.errors.assignedTo)}
					>
						{users.map((user) => (
							<MenuItem key={user._id} value={user._id}>
								{user.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Stack direction="row" spacing={2}>
					<FormControl fullWidth>
						<InputLabel id="status-label">Status</InputLabel>
						<Select
							labelId="status-label"
							id="status"
							name="status"
							value={formik.values.status}
							onChange={formik.handleChange}
							label="Status"
							error={formik.touched.status && Boolean(formik.errors.status)}
						>
							<MenuItem value="todo">To Do</MenuItem>
							<MenuItem value="in-progress">In Progress</MenuItem>
							<MenuItem value="completed">Completed</MenuItem>
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel id="priority-label">Priority</InputLabel>
						<Select
							labelId="priority-label"
							id="priority"
							name="priority"
							value={formik.values.priority}
							onChange={formik.handleChange}
							label="Priority"
							error={formik.touched.priority && Boolean(formik.errors.priority)}
						>
							<MenuItem value="low">Low</MenuItem>
							<MenuItem value="medium">Medium</MenuItem>
							<MenuItem value="high">High</MenuItem>
						</Select>
					</FormControl>
				</Stack>

				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						label="Due Date"
						value={formik.values.dueDate || null}
						onChange={(date: any) => formik.setFieldValue('dueDate', date)}
						renderInput={(params: any) => (
							<TextField {...params} fullWidth />
						)}
					/>
				</LocalizationProvider>

				<Box display="flex" justifyContent="flex-end" gap={2}>
					{onCancel && (
						<Button variant="outlined" onClick={onCancel}>
							Cancel
						</Button>
					)}
					<Button type="submit" variant="contained" color="primary">
						{initialValues?._id ? 'Update Task' : 'Create Task'}
					</Button>
				</Box>
			</Stack>
		</Box>
	);
};

export default TaskForm;