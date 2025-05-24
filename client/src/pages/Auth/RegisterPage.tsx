import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Box,
	Button,
	Container,
	Grid,
	TextField,
	Typography,
	Avatar,
	CssBaseline,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../../context/AuthContext';

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const { register } = useAuth();

	const validationSchema = Yup.object({
		username: Yup.string()
			.max(50, 'Name should be of maximum 50 characters length')
			.required('Name is required'),
		email: Yup.string()
			.email('Enter a valid email')
			.required('Email is required'),
		password: Yup.string()
			.min(8, 'Password should be of minimum 8 characters length')
			.required('Password is required'),
		// confirmPassword: Yup.string()
		// 	.oneOf([Yup.ref('password')], 'Passwords must match')
		// 	.required('Confirm Password is required'),
	});

	const formik = useFormik({
		initialValues: {
			username: '',
			email: '',
			password: '',
			// confirmPassword: '',
		},
		validationSchema,
		onSubmit: async (values) => {
			try {
				await register(values.username, values.email, values.password);
				navigate('/');
			} catch (error) {
				formik.setStatus(
					error instanceof Error ? error.message : 'Registration failed. Please try again.'
				);
			}
		},
	});

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<PersonAddIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				{formik.status && (
					<Typography color="error" sx={{ mt: 2 }}>
						{formik.status}
					</Typography>
				)}
				<Box
					component="form"
					noValidate
					onSubmit={formik.handleSubmit}
					sx={{ mt: 3 }}
				>

					<Grid container spacing={2}>
						{/* <Grid
						// item 
						// xs={12}
						// sm={6}
						> */}
						<TextField
							autoComplete="username"
							name="username"
							required
							fullWidth
							id="username"
							label="Username"
							value={formik.values.username}
							onChange={formik.handleChange}
							error={formik.touched.username && Boolean(formik.errors.username)}
							helperText={formik.touched.username && formik.errors.username}
						/>
						{/* </Grid> */}
						{/* <Grid
						// item xs={12}
						> */}
						<TextField
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
						/>
						{/* </Grid>
						<Grid
						// item xs={12}
						> */}
						<TextField
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="new-password"
							value={formik.values.password}
							onChange={formik.handleChange}
							error={formik.touched.password && Boolean(formik.errors.password)}
							helperText={formik.touched.password && formik.errors.password}
						/>
						{/* </Grid> */}
						{/* <Grid
						// item xs={12}
						>
							<TextField
								required
								fullWidth
								name="confirmPassword"
								label="Confirm Password"
								type="password"
								id="confirmPassword"
								value={formik.values.confirmPassword}
								onChange={formik.handleChange}
								error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
								helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
							/>
						</Grid> */}
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						disabled={formik.isSubmitting}
					>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid>
							<Link to="/login" style={{ textDecoration: 'none' }}>
								<Typography variant="body2" color="primary">
									Already have an account? Sign in
								</Typography>
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
};

export default RegisterPage;
