import { Task, Project, TeamMember } from '../types';

export const calculateTaskStats = (tasks: Task[]) => {
	const totalTasks = tasks.length;
	const completedTasks = tasks.filter(task => task.status === 'completed').length;
	const pendingTasks = totalTasks - completedTasks;
	const overdueTasks = tasks.filter(task =>
		task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
	).length;

	return {
		totalTasks,
		completedTasks,
		pendingTasks,
		overdueTasks,
	};
};

export const calculateProjectProgress = (projects: Project[], allTasks: Task[]) => {
	return projects.map(project => {
		const projectTasks = allTasks.filter(task =>
			typeof task.project === 'string' ? task.project === project._id : task.project._id === project._id
		);
		const totalTasks = projectTasks.length;
		const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
		const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

		return {
			projectId: project._id,
			title: project.title,
			totalTasks,
			completedTasks,
			completionPercentage,
		};
	});
};

export const calculateUserTaskStats = (teamMembers: TeamMember[], allTasks: Task[]) => {
	return teamMembers.map(member => {
		const userTasks = allTasks.filter(task =>
			typeof task.assignedTo === 'string' ? task.assignedTo === member._id : task.assignedTo._id === member._id
		);
		const totalTasks = userTasks.length;
		const completedTasks = userTasks.filter(task => task.status === 'completed').length;
		const pendingTasks = totalTasks - completedTasks;

		return {
			userId: member._id,
			name: member.name,
			totalTasks,
			completedTasks,
			pendingTasks,
		};
	});
};