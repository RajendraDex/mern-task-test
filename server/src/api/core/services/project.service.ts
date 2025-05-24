import mongoose, { ObjectId, Types } from 'mongoose';
import { Project } from '../models/project.model';
import { IProject } from '../models/interfaces';
import { ApiError } from '../utils/apiError.util';
import httpStatus from 'http-status';
import { toObjectId } from '../utils/mogoose.util';
import { customPagination } from '../utils/pagination.util';

interface ListOptions {
	page: number,
	limit: number,
	filter: Record<string, any>,
	sortBy: { name: string, order: 'asc' | 'desc' }
}

export class ProjectService {

	constructor() { }

	async create(ownerId: ObjectId, data: Partial<IProject>): Promise<IProject> {
		const isProjectExists = await Project.findOne({ name: data.name, owner: ownerId });
		if (isProjectExists) throw new ApiError(httpStatus.BAD_REQUEST, 'Project already exists');
		const project = new Project({ ...data, owner: ownerId });
		return project.save();
	}

	async update(ownerId: string, projectId: string, data: Partial<IProject>): Promise<IProject | null> {
		const project = await Project.findOne({ _id: toObjectId(projectId), owner: toObjectId(ownerId) });
		if (!project) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
		Object.assign(project, data);
		return project.save();
	}

	async getProjectDetails(projectId: string): Promise<IProject | null> {
		const projectObjectId = toObjectId(projectId);
		const project = await Project.findOne({ _id: projectObjectId });
		if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
		return project;
	}

	async remove(ownerId: string, projectId: string): Promise<void> {
		const project = await Project.findOne({ _id: toObjectId(projectId), owner: toObjectId(ownerId) });
		if (!project) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
		await project.deleteOne();
	}

	async assignMembers(ownerId: string, projectId: string, members: string[]): Promise<IProject | null> {
		const ownerObjectId = toObjectId(ownerId);
		const projectObjectId = toObjectId(projectId);
		const project = await Project.findOne({ _id: projectObjectId, owner: ownerObjectId });
		if (!project) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');

		const membersObjectId = members.map((member) => toObjectId(member));
		const newMembers = [...new Set([...project.members, ...membersObjectId])];
		project.members = newMembers as Types.ObjectId[];

		return project.save();
	}
	async removeMembers(ownerId: string, projectId: string, members: string[]): Promise<IProject | null> {
		const project = await Project.findOne({ _id: projectId, owner: ownerId });
		if (!project) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
		const memberIdsInString = project.members.map(id => id.toString());
		const retainedMembers = memberIdsInString.filter((memberId) => !members.includes(memberId));
		const retainedMembersObjectId = retainedMembers.map((member: string) => toObjectId(member));
		const newMembers = [...new Set([...retainedMembersObjectId])];
		project.members = newMembers as Types.ObjectId[];
		return project.save();
	}

	async list(ownerId: string, options: ListOptions): Promise<{ results: IProject[]; total: number; page: number; limit: number }> {

		const { page = 1, limit = 10, filter, sortBy } = options;
		const filterObject: any = {
			...filter,
			owner: ownerId
		};

		if (filter.name) filterObject.name = { $regex: filter.name, $options: 'i' };

		const sort: Record<string, 1 | -1> = {};
		if (sortBy?.name) {
			sort[sortBy.name] = sortBy.order === 'asc' ? 1 : -1;
		} else {
			sort['createdAt'] = -1;
		}

		const skip = (page - 1) * limit;
		const [results, total] = await Promise.all([
			Project.find(filterObject)
				.skip(skip)
				.limit(limit)
				.populate('members', 'username email')
				.sort(sort),
			Project.countDocuments(filter),
		]);

		const pagination = customPagination(results, page, limit, total);
		return pagination;
	}

}

const projectService = new ProjectService();
export { projectService };
