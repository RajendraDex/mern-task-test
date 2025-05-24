import React, { useState } from 'react';
import { User } from '../../types';
import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Autocomplete,
	Chip,
	Typography,
} from '@mui/material';

interface AddTeamMemberFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (userId: string, role: 'admin' | 'member') => void;
	availableUsers: User[];
	existingMembers: User[];
}

const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({
	open,
	onClose,
	onSubmit,
	availableUsers,
	existingMembers,
}) => {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [role, setRole] = useState<'admin' | 'member'>('member');

	const handleSubmit = () => {
		if (selectedUser) {
			onSubmit(selectedUser._id, role);
			setSelectedUser(null);
			setRole('member');
		}
	};

	const filteredUsers = availableUsers.filter(
		(user) => !existingMembers.some((member) => member._id === user._id)
	);

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Add Team Member</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					<Autocomplete
						options={filteredUsers}
						getOptionLabel={(user) => `${user.name} (${user.email})`}
						value={selectedUser}
						onChange={(_, newValue) => setSelectedUser(newValue)}
						renderInput={(params) => (
							<TextField {...params} label="Select User" fullWidth />
						)}
						renderOption={(props, user) => (
							<li {...props} key={user._id}>
								<Box>
									<Typography>{user.name}</Typography>
									<Typography variant="body2" color="text.secondary">
										{user.email}
									</Typography>
								</Box>
							</li>
						)}
					/>
				</Box>
				<Box sx={{ mt: 3 }}>
					<Typography variant="subtitle1" gutterBottom>
						Role
					</Typography>
					<Box display="flex" gap={1}>
						<Chip
							label="Member"
							color={role === 'member' ? 'primary' : 'default'}
							onClick={() => setRole('member')}
							sx={{ cursor: 'pointer' }}
						/>
						<Chip
							label="Admin"
							color={role === 'admin' ? 'primary' : 'default'}
							onClick={() => setRole('admin')}
							sx={{ cursor: 'pointer' }}
						/>
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={handleSubmit}
					variant="contained"
					disabled={!selectedUser}
				>
					Add Member
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddTeamMemberForm;