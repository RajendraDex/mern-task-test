import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { taskService } from '../services/task.service';
import { IRequest } from '../types/interfaces';


export class TaskController {
	static async create(req: IRequest, res: Response, next: NextFunction) {
		try {
			req.body.assignee = req.user._id;
			const task = await taskService.create(req.body);
			res.status(httpStatus.CREATED).json({
				status: httpStatus.CREATED,
				message: `Task created successfully for porject ${req.params.projectId}`,
				task
			});
		} catch (err) {
			next(err);
		}
	}

	static async updateStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const updatedTask = await taskService.updateStatus(req.params.taskId, req.body.status);
			res.status(httpStatus.OK).json({
				status: httpStatus.OK,
				message: 'Task status updated successfully',
				task: updatedTask
			});
		} catch (err) {
			next(err);
		}
	}

	static async getByUser(req: Request, res: Response, next: NextFunction) {
		try {
			const tasks = await taskService.getByUser(req.params.userId);
			res.status(httpStatus.OK).json({
				status: httpStatus.OK,
				message: 'Task status updated successfully',
				tasks
			});
		} catch (err) {
			next(err);
		}
	}
	static async getTaskList(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit, filter, sortBy, projectId } = req.body;

			const options = {
				page,
				limit,
				filter,
				sortBy
			}
			const tasks = await taskService.list(options);
			res.status(httpStatus.OK).json({
				status: httpStatus.OK,
				message: 'Get tasks successfully',
				tasks
			});
		} catch (err) {
			next(err);
		}
	}
}