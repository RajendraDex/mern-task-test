import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, Stack } from '@mui/material';
import { Project } from '../../types';

interface ProjectFormProps {
	initialValues?: Partial<Project>;
	onSubmit: (values: Partial<Project>) => void;
	onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues, onSubmit, onCancel }) => {
	const validationSchema = Yup.object({
		name: Yup.string().required('Title is required'),
		description: Yup.string().required('Description is required'),
	});

	const formik = useFormik({
		initialValues: initialValues || {
			name: '',
			description: '',
		},
		validationSchema,
		onSubmit: (values) => {
			onSubmit(values);
		},
	});

	return (
		<Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
			<Stack spacing={2}>
				<TextField
					fullWidth
					id="name"
					name="name"
					label="Project Title"
					value={formik.values.name}
					onChange={formik.handleChange}
					error={formik.touched.name && Boolean(formik.errors.name)}
					helperText={formik.touched.name && formik.errors.name}
				/>
				<TextField
					fullWidth
					id="description"
					name="description"
					label="Project Description"
					multiline
					rows={4}
					value={formik.values.description}
					onChange={formik.handleChange}
					error={formik.touched.description && Boolean(formik.errors.description)}
					helperText={formik.touched.description && formik.errors.description}
				/>
				<Box display="flex" justifyContent="flex-end" gap={2}>
					{onCancel && (
						<Button variant="outlined" onClick={onCancel}>
							Cancel
						</Button>
					)}
					<Button type="submit" variant="contained" color="primary">
						{initialValues?._id ? 'Update Project' : 'Create Project'}
					</Button>
				</Box>
			</Stack>
		</Box>
	);
};

export default ProjectForm;