import { Project, Task } from '../models';
import { ITask } from '../models/interfaces';


export class DashboardService {

	constructor() { }

	async getStats(userId: string) {
		const projects = await Project.find({
			$or: [{ owner: userId }, { members: userId }],
		});

		const tasks = await Task.find({
			project: { $in: projects.map(p => p._id) },
		});

		const totalProjects = projects.length;
		const totalTasks = tasks.length;
		const completedTasks = tasks.filter(t => t.status === 'completed').length;
		const pendingTasks = totalTasks - completedTasks;
		const overdueTasks = tasks.filter(
			t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
		).length;

		const teamMembersSet = new Set<string>();
		projects.forEach(project => {
			project.members.forEach(member => {
				if (member.toString() !== userId.toString()) {
					teamMembersSet.add(member.toString());
				}
			});
		});

		return {
			totalProjects,
			totalTasks,
			completedTasks,
			pendingTasks,
			overdueTasks,
			teamMembers: teamMembersSet.size,
		};
	}

	async getUserStats(userId: string) {
		const projects = await Project.find({ $or: [{ owner: userId }, { members: userId }] });

		const tasks: ITask[] = await Task.find({ project: { $in: projects.map(p => p._id) } })
			.populate('assignedTo', 'username');

		const userStats: Record<string, any> = {};

		tasks.forEach(task => {
			if (typeof task.assignedTo === 'object' && 'username' in task.assignedTo) {
				const assignedToId = task.assignedTo._id.toString();
				if (!userStats[assignedToId]) {
					userStats[assignedToId] = {
						userId: assignedToId,
						name: task.assignedTo.username,
						totalTasks: 0,
						completedTasks: 0,
						pendingTasks: 0,
					};
				}

				userStats[assignedToId].totalTasks++;
				if (task.status === 'completed') {
					userStats[assignedToId].completedTasks++;
				} else {
					userStats[assignedToId].pendingTasks++;
				}
			}
		});

		return Object.values(userStats);
	}

	async getProjectProgress(userId: string) {
		const projects = await Project.find({ $or: [{ owner: userId }, { members: userId }], });

		const tasks = await Task.find({ project: { $in: projects.map(p => p._id) } });

		return projects.map(project => {
			const projectTasks = tasks.filter(t => t.project.toString() === project._id.toString());
			const totalTasks = projectTasks.length;
			const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
			const completionPercentage = totalTasks > 0
				? Math.round((completedTasks / totalTasks) * 100)
				: 0;

			return {
				projectId: project._id,
				title: project.name,
				totalTasks,
				completedTasks,
				completionPercentage,
			};
		});
	}
}


const mainService = new DashboardService()

export { mainService }
