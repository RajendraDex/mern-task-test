import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? (
		children ? (
			<>{children}</>
		) : (
			<Outlet />
		)
	) : (
		<Navigate to="/login" replace />
	);
};

export default PrivateRoute;