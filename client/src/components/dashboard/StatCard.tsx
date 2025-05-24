import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StatCardRoot = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(3),
	boxShadow: theme.shadows[1],
	height: '100%',
}));

interface StatCardProps {
	title: string;
	value: string | number;
	icon?: React.ReactNode;
	progress?: number;
	color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, progress, color = 'primary' }) => {
	return (
		<StatCardRoot>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="subtitle2" color="text.secondary">
					{title}
				</Typography>
				{icon}
			</Box>
			<Typography variant="h4" component="div" gutterBottom>
				{value}
			</Typography>
			{progress !== undefined && (
				<LinearProgress
					variant="determinate"
					value={progress}
					color={color}
					sx={{ height: 8, borderRadius: 4 }}
				/>
			)}
		</StatCardRoot>
	);
};

export default StatCard;