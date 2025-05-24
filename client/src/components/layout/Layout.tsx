// import React, { useState } from 'react';
// import { Box, Toolbar } from '@mui/material';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// interface LayoutProps {
// 	children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
// 	const drawerWidth = 240;
// 	const [mobileOpen, setMobileOpen] = useState(false);

// 	const handleDrawerToggle = () => {
// 		setMobileOpen(!mobileOpen);
// 	};

// 	return (
// 		<Box sx={{ display: 'flex' }}>
// 			<Navbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
// 			<Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
// 			<Box
// 				component="main"
// 				sx={{
// 					flexGrow: 1,
// 					p: 3,
// 					width: { sm: `calc(100% - ${drawerWidth}px)` },
// 				}}
// 			>
// 				<Toolbar /> {/* This is needed for content to start below the app bar */}
// 				{children}
// 			</Box>
// 		</Box>
// 	);
// };

// export default Layout;

import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
	const drawerWidth = 240;
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<Navbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
			<Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}
			>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;
