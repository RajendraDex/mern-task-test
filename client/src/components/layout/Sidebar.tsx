import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
	drawerWidth: number;
	mobileOpen: boolean;
	handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
	const { user } = useAuth();

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				<ListItem
					//  button 
					component={Link} to="/">
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard" />
				</ListItem>
				<ListItem
					// button 
					component={Link} to="/projects">
					<ListItemIcon>
						<AssignmentIcon />
					</ListItemIcon>
					<ListItemText primary="Projects" />
				</ListItem>
				<ListItem
					// button 
					component={Link} to="/tasks">
					<ListItemIcon>
						<AssignmentIcon />
					</ListItemIcon>
					<ListItemText primary="Tasks" />
				</ListItem>
				{user?.role === 'admin' && (
					<ListItem
						//  button 
						component={Link} to="/team">
						<ListItemIcon>
							<PeopleIcon />
						</ListItemIcon>
						<ListItemText primary="Team" />
					</ListItem>
				)}
			</List>
			<Divider />
			{/* <List>
				<ListItem
					// button 
					component={Link} to="/settings">
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary="Settings" />
				</ListItem>
			</List> */}
		</div>
	);

	return (
		<Box
			component="nav"
			sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			aria-label="mailbox folders"
		>
			{/* Mobile drawer */}
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
			>
				{drawer}
			</Drawer>
			{/* Desktop drawer */}
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
};

export default Sidebar;