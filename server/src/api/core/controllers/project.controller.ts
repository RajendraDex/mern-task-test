import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { IRequest } from '../types/interfaces';
import { ObjectId } from 'mongoose';

export class ProjectController {
	static async create(req: IRequest, res: Response, next: NextFunction) {
		try {
			const userId = req.user._id as ObjectId;
			const project = await projectService.create(userId, req.body);
			res.status(201).json(project);
		} catch (err) {
			next(err);
		}
	}

	static async update(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updatedProject = await projectService.update(req.user!.id, req.params.id, req.body);
			res.status(200).json(updatedProject);
		} catch (err) {
			next(err);
		}
	}

	static async remove(req: IRequest, res: Response, next: NextFunction) {
		try {
			await projectService.remove(req.user!.id, req.params.id);
			res.status(204).end();
		} catch (err) {
			next(err);
		}
	}

	static async assignMembers(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updated = await projectService.assignMembers(req.user!.id, req.params.id, req.body.members);
			res.status(200).json(updated);
		} catch (err) {
			next(err);
		}
	}
}