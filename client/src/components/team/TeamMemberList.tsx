import React from 'react';
import { TeamMember } from '../../types';
import { Box, Typography, Chip, Stack, Button, Menu, MenuItem, Avatar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface TeamMemberListProps {
	members: TeamMember[];
	currentUserId: string;
	isOwner: boolean;
	onRoleChange: (userId: string, newRole: 'admin' | 'member') => void;
	onRemove: (userId: string) => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({
	members,
	currentUserId,
	isOwner,
	onRoleChange,
	onRemove,
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [selectedMember, setSelectedMember] = React.useState<string | null>(null);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, memberId: string) => {
		setAnchorEl(event.currentTarget);
		setSelectedMember(memberId);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedMember(null);
	};

	const handleRoleChange = (newRole: 'admin' | 'member') => {
		if (selectedMember) {
			onRoleChange(selectedMember, newRole);
		}
		handleMenuClose();
	};

	const handleRemove = () => {
		if (selectedMember) {
			onRemove(selectedMember);
		}
		handleMenuClose();
	};

	return (
		<Box sx={{ mt: 2 }}>
			<Typography variant="h6" gutterBottom>
				Team Members ({members.length})
			</Typography>
			<Stack spacing={2}>
				{members.map((member) => (
					<Box
						key={member._id}
						display="flex"
						alignItems="center"
						justifyContent="space-between"
						sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}
					>
						<Box display="flex" alignItems="center">
							<Avatar sx={{ mr: 2 }}>
								{member.name.charAt(0).toUpperCase()}
							</Avatar>
							<Box>
								<Typography variant="body1">{member.name}</Typography>
								<Typography variant="body2" color="text.secondary">
									{member.email}
								</Typography>
							</Box>
						</Box>
						<Box display="flex" alignItems="center">
							<Chip
								label={member.role.toUpperCase()}
								color={member.role === 'admin' ? 'primary' : 'default'}
								size="small"
								sx={{ mr: 2 }}
							/>
							{(isOwner || member._id === currentUserId) && (
								<>
									<Button
										size="small"
										onClick={(e) => handleMenuOpen(e, member._id)}
									>
										<MoreVertIcon />
									</Button>
									<Menu
										anchorEl={anchorEl}
										open={Boolean(anchorEl && selectedMember === member._id)}
										onClose={handleMenuClose}
									>
										{member.role === 'member' && (
											<MenuItem onClick={() => handleRoleChange('admin')}>
												Make Admin
											</MenuItem>
										)}
										{member.role === 'admin' && (
											<MenuItem onClick={() => handleRoleChange('member')}>
												Make Regular Member
											</MenuItem>
										)}
										{isOwner && member._id !== currentUserId && (
											<MenuItem onClick={handleRemove} sx={{ color: 'error.main' }}>
												Remove from Team
											</MenuItem>
										)}
									</Menu>
								</>
							)}
						</Box>
					</Box>
				))}
			</Stack>
		</Box>
	);
};

export default TeamMemberList;