import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Box,
	Button,
	Checkbox,
	Container,
	FormControlLabel,
	Grid,
	TextField,
	Typography,
	Avatar,
	CssBaseline,
	Paper,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const validationSchema = Yup.object({
		email: Yup.string()
			.email('Enter a valid email')
			.required('Email is required'),
		password: Yup.string()
			.min(8, 'Password should be of minimum 8 characters length')
			.required('Password is required'),
	});

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			remember: false,
		},
		validationSchema,
		onSubmit: async (values) => {
			try {
				await login(values.email, values.password);
				navigate('/');
			} catch (error) {
				formik.setStatus(
					error instanceof Error ? error.message : 'Login failed. Please try again.'
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
				<Paper elevation={3} sx={{ p: 4, width: '100%' }}>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main', mx: 'auto' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5" align="center">
						Sign in
					</Typography>
					{formik.status && (
						<Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
							{formik.status}
						</Typography>
					)}
					<Box
						component="form"
						onSubmit={formik.handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={formik.values.password}
							onChange={formik.handleChange}
							error={formik.touched.password && Boolean(formik.errors.password)}
							helperText={formik.touched.password && formik.errors.password}
						/>
						<FormControlLabel
							control={
								<Checkbox
									name="remember"
									color="primary"
									checked={formik.values.remember}
									onChange={formik.handleChange}
								/>
							}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={formik.isSubmitting}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid
							// item xs
							>
								<Link to="/forgot-password" style={{ textDecoration: 'none' }}>
									<Typography variant="body2" color="primary">
										Forgot password?
									</Typography>
								</Link>
							</Grid>
							<Grid
							// item
							>
								<Link to="/register" style={{ textDecoration: 'none' }}>
									<Typography variant="body2" color="primary">
										Don't have an account? Sign Up
									</Typography>
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default LoginPage;