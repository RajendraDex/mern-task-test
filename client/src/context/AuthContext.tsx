import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			const storedToken = localStorage.getItem('token');
			const tokenExpireTime = localStorage.getItem('tokenExpireTime');

			if (storedToken && tokenExpireTime && new Date(tokenExpireTime) > new Date()) {
				try {
					const { data: userData } = await getCurrentUser();
					if (userData) {
						setUser(userData);
						setToken(storedToken);
					}
				} catch (error) {
					localStorage.removeItem('token');
					localStorage.removeItem('tokenExpireTime');
				}
			} else {
				localStorage.removeItem('token');
				localStorage.removeItem('tokenExpireTime');
			}
			setLoading(false);
		};

		initializeAuth();
	}, []);

	const login = async (email: string, password: string) => {
		const { data, error } = await apiLogin(email, password);
		if (error || !data) {
			throw new Error(error || 'Login failed');
		}
		const token = data.token?.access?.token;
		localStorage.setItem('token', token);
		localStorage.setItem('tokenExpireTime', data.token.access.expires);
		setUser(data.user);
		setToken(token);
	};

	const register = async (username: string, email: string, password: string) => {
		const { data, error } = await apiRegister(username, email, password);
		if (error || !data) {
			throw new Error(error || 'Registration failed');
		}
	};

	const logout = async () => {
		const data = await apiLogout();
		if (data.status === 204) {
			localStorage.removeItem('token');
			localStorage.removeItem('tokenExpireTime');
			setUser(null);
			setToken(null);
		} else {
			throw new Error('Unable to logout');
		}
	};

	const value = {
		user,
		token,
		login,
		register,
		logout,
		isAuthenticated: !!user,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
