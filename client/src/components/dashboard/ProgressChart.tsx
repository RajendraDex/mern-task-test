import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography } from '@mui/material';
import { ProjectProgress } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProgressChartProps {
	data: ProjectProgress[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
	const chartData = {
		labels: data.map(item => item.title),
		datasets: [
			{
				label: 'Completed Tasks',
				data: data.map(item => item.completedTasks),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
			},
			{
				label: 'Pending Tasks',
				data: data.map(item => item.pendingTasks),
				backgroundColor: 'rgba(255, 99, 132, 0.6)',
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Project Progress',
			},
		},
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
			},
		},
	};

	return (
		<Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
			<Typography variant="h6" gutterBottom>
				Project Progress
			</Typography>
			<Bar data={chartData} options={options} />
		</Box>
	);
};

export default ProgressChart;