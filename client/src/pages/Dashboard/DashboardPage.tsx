import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, GridProps } from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import ProgressChart from '../../components/dashboard/ProgressChart';
import UserTasksTable from '../../components/dashboard/UserTasksTable';
import { getDashboardStats, getUserTaskStats, getProjectProgress } from '../../api/dashboard';
import { DashboardStats, UserTaskStats, ProjectProgress } from '../../types';
import {
	CheckCircleOutline as CheckCircleOutlineIcon,
	Assignment as AssignmentIcon,
	People as PeopleIcon,
	ErrorOutline as ErrorOutlineIcon,
	Folder as FolderIcon,
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [userStats, setUserStats] = useState<UserTaskStats[]>([]);
	const [projectProgress, setProjectProgress] = useState<ProjectProgress[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);

				const [
					{ data: statsData },
					{ data: userStatsData },
					{ data: projectProgressData },
				] = await Promise.all([
					getDashboardStats(),
					getUserTaskStats(),
					getProjectProgress(),
				]);

				if (statsData) setStats(statsData);
				if (userStatsData) setUserStats(userStatsData);
				if (projectProgressData) setProjectProgress(projectProgressData);
			} catch (error) {
				console.error('Failed to fetch dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
				<CircularProgress />
			</Box>
		);
	}

	if (!stats) {
		return <Box>Failed to load dashboard data</Box>;
	}

	return (
		<Box sx={{ p: 3 }}>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6, lg: 2 }} >
					<StatCard
						title="Total Projects"
						value={stats.totalProjects || 0}
						icon={<FolderIcon color="primary" />}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 2 }}>
					<StatCard
						title="Total Tasks"
						value={stats.totalTasks || 0}
						icon={<AssignmentIcon color="secondary" />}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 2 }}>
					<StatCard
						title="Completed Tasks"
						value={stats.completedTasks || 0}
						icon={<CheckCircleOutlineIcon color="success" />}
						progress={(stats.completedTasks / stats.totalTasks) * 100}
						color="success"
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 2 }}>
					<StatCard
						title="Overdue Tasks"
						value={stats.overdueTasks || 0}
						icon={<ErrorOutlineIcon color="error" />}
						color="error"
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 2 }}>
					<StatCard
						title="Team Members"
						value={stats.teamMembers}
						icon={<PeopleIcon color="info" />}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 2 }} >
					<StatCard
						title="Task Completion Rate"
						value={`${Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}%`}
						progress={(stats.completedTasks / stats.totalTasks) * 100 || 0}
						color="primary"
					/>
				</Grid>
				<Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 4, mb: 4 }}>
					{projectProgress.length > 0 && <ProgressChart data={projectProgress} />}
				</Grid>
				<Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 4, mb: 4 }}>
					{userStats.length > 0 && <UserTasksTable data={userStats} />}
				</Grid>
			</Grid>
		</Box >
	);
};

export default DashboardPage;