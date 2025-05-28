import { Task } from '../models/task.model';
import { ITask } from '../models/interfaces';
import { ApiError } from '../utils/apiError.util';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { toObjectId } from '../utils/mogoose.util';
import { customPagination } from '../utils/pagination.util';
import { ListOptions } from '../types/interfaces';

export class TaskService {
	async create(data: Partial<ITask>): Promise<ITask> {
		if (!data.project) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Project Id is missing')
		}
		const task = new Task({ ...data });
		return task.save();
	}

	async updateStatus(taskId: string, status: string): Promise<ITask | null> {
		const taskObjectId = new mongoose.Types.ObjectId(taskId);
		return Task.findByIdAndUpdate(taskObjectId, { status }, { new: true });
	}

	async getByUser(userId: string): Promise<ITask[]> {
		const userObjectId = new mongoose.Types.ObjectId(userId);
		return Task.find({ assignee: userObjectId });
	}

	async list(options: ListOptions): Promise<{ results: ITask[]; total: number; page: number; limit: number }> {

		const { page = 1, limit = 10, filter, sortBy } = options;

		const filterObject: any = {
			...filter,
		};

		if (filter.title) filterObject.title = { $regex: filter.title, $options: 'i' };
		if (filter.projectId) filterObject.project = toObjectId(filter.projectId);

		delete filterObject.projectId

		const sort: Record<string, 1 | -1> = {};
		if (sortBy?.name) {
			sort[sortBy.name] = sortBy.order === 'asc' ? 1 : -1;
		} else {
			sort['createdAt'] = -1;
		}

		const skip = (page - 1) * limit;
		const [results, total] = await Promise.all([
			Task.find(filterObject)
				.skip(skip)
				.limit(limit)
				.sort(sort),
			Task.countDocuments(filterObject),
		]);

		const pagination = customPagination(results, page, limit, total);
		return pagination;
	}


}

const taskService = new TaskService();
export { taskService };