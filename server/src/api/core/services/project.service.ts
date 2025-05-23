import { Project } from '../models/project.model';
import { IProject } from '../models/interfaces';
import { ApiError } from '../utils/apiError.util';
import httpStatus from 'http-status';
import { ObjectId } from 'mongoose';

export class ProjectService {

	constructor() { }

	async create(ownerId: ObjectId, data: Partial<IProject>): Promise<IProject> {
		const project = new Project({ ...data, owner: ownerId });
		return project.save();
	}

	async update(ownerId: string, projectId: string, data: Partial<IProject>): Promise<IProject | null> {
		const project = await Project.findOne({ _id: projectId, owner: ownerId });
		if (!project) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
		Object.assign(project, data);
		return project.save();
	}

	async remove(ownerId: string, projectId: string): Promise<void> {
		const project = await Project.findOne({ _id: projectId, owner: ownerId });
		if (!project) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
		await project.deleteOne();
	}

	async assignMembers(ownerId: string, projectId: string, members: string[]): Promise<IProject | null> {
		const project = await Project.findOne({ _id: projectId, owner: ownerId });
		if (!project) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
		// project.members = members;
		return project.save();
	}
}

const projectService = new ProjectService();
export { projectService };
