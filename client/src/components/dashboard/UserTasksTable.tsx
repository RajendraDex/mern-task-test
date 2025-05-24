import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { UserTaskStats } from '../../types';

interface UserTasksTableProps {
	data: UserTaskStats[];
}

const UserTasksTable: React.FC<UserTasksTableProps> = ({ data }) => {
	return (
		<Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
			<Typography variant="h6" gutterBottom>
				Team Task Distribution
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Team Member</TableCell>
							<TableCell align="right">Total Tasks</TableCell>
							<TableCell align="right">Completed</TableCell>
							<TableCell align="right">Pending</TableCell>
							<TableCell align="right">Completion Rate</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((user) => (
							<TableRow key={user.userId}>
								<TableCell component="th" scope="row">
									{user.name}
								</TableCell>
								<TableCell align="right">{user.totalTasks}</TableCell>
								<TableCell align="right">{user.completedTasks}</TableCell>
								<TableCell align="right">{user.pendingTasks}</TableCell>
								<TableCell align="right">
									{user.totalTasks > 0
										? `${Math.round((user.completedTasks / user.totalTasks) * 100)}%`
										: '-'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default UserTasksTable;