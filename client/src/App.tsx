// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import PrivateRoute from './routes/PrivateRoute';
// import LoginPage from './pages/Auth/LoginPage';
// import RegisterPage from './pages/Auth/RegisterPage';
// import DashboardPage from './pages/Dashboard/DashboardPage';
// import ProjectsPage from './pages/Projects/ProjectsPage';
// import ProjectDetailPage from './pages/Projects/ProjectDetailPage';
// import TasksPage from './pages/Tasks/TasksPage';


// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/" element={<PrivateRoute />}>
//             <Route index element={<DashboardPage />} />
//             <Route path="projects" element={<ProjectsPage />} />
//             <Route path="projects/:id" element={<ProjectDetailPage />} />
//             <Route path="projects/:projectId/tasks" element={<TasksPage />} />
//             <Route path="tasks" element={<TasksPage />} />
//           </Route>
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProjectDetailPage from './pages/Projects/ProjectDetailPage';
import TasksPage from './pages/Tasks/TasksPage';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes with layout */}
          <Route path="/" element={<PrivateRoute><Layout> </Layout></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="projects/:projectId/tasks" element={<TasksPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;