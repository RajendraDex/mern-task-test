import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { IRequest } from '../types/interfaces';
import { ObjectId } from 'mongoose';
import httpStatus from 'http-status';

export class ProjectController {
	static async create(req: IRequest, res: Response, next: NextFunction) {
		try {
			const userId = req.user._id as ObjectId;
			const project = await projectService.create(userId, req.body);
			res.status(httpStatus.CREATED).json(project);
		} catch (err) {
			next(err);
		}
	}

	static async getProject(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updatedProject = await projectService.getProjectDetails(req.params.projectId);
			res.status(httpStatus.OK).json(updatedProject);
		} catch (err) {
			next(err);
		}
	}
	static async getProjectMembers(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updatedProject = await projectService.getProjectTeam(req.params.projectId);
			res.status(httpStatus.OK).json(updatedProject);
		} catch (err) {
			next(err);
		}
	}

	static async update(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updatedProject = await projectService.update(req.user!._id, req.params.projectId, req.body);
			res.status(httpStatus.OK).json(updatedProject);
		} catch (err) {
			next(err);
		}
	}

	static async remove(req: IRequest, res: Response, next: NextFunction) {
		try {
			await projectService.remove(req.user!._id, req.params.projectId);
			res.status(httpStatus.NO_CONTENT).end();
		} catch (err) {
			next(err);
		}
	}

	static async assignMembers(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updated = await projectService.assignMembers(req.user!._id, req.params.projectId, req.body.members);
			res.status(httpStatus.OK).json(updated);
		} catch (err) {
			next(err);
		}
	}

	static async removeMembers(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updated = await projectService.assignMembers(req.user!._id, req.params.projectId, req.body.members);
			res.status(httpStatus.OK).json(updated);
		} catch (err) {
			next(err);
		}
	}
	static async getProjectList(req: IRequest, res: Response, next: NextFunction) {
		try {
			const { page, limit, filter, sortBy } = req.body;

			const options = {
				page,
				limit,
				filter,
				sortBy
			}
			const updated = await projectService.list(req.user!._id, options);
			res.status(httpStatus.OK).json(updated);
		} catch (err) {
			next(err);
		}
	}
}