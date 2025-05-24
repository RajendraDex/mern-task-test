import { Task } from '../models/task.model';
import { ITask } from '../models/interfaces';
import { ApiError } from '../utils/apiError.util';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

export class TaskService {
	async create(projectId: string, data: Partial<ITask>): Promise<ITask> {
		const projectObjectId = new mongoose.Types.ObjectId(projectId);
		const task = new Task({ ...data, project: projectObjectId });
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
}

const taskService = new TaskService();
export { taskService };