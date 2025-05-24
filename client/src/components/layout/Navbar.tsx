import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Avatar, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
	drawerWidth: number;
	handleDrawerToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ drawerWidth, handleDrawerToggle }) => {
	const { user, logout } = useAuth();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleMenuClose();
		logout();
	};

	return (
		<AppBar
			position="fixed"
			sx={{
				width: { sm: `calc(100% - ${drawerWidth}px)` },
				ml: { sm: `${drawerWidth}px` },
			}}
		>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { sm: 'none' } }}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
					Project Management
				</Typography>
				{user ? (
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
							<Avatar alt={user.name} src="/" />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem component={Link} to="/profile">Profile</MenuItem>
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</Menu>
					</Box>
				) : (
					<Button color="inherit" component={Link} to="/login">
						Login
					</Button>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;