import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { mainService } from '../services/main.services';
import { IRequest } from '../types/interfaces';

export class DashboardController {
	static async stats(req: IRequest, res: Response, next: NextFunction) {
		try {
			const data = await mainService.getStats(req.user._id);
			res.status(httpStatus.OK).json({ status: httpStatus.OK, message: 'Get status successfully', success: true, data });
		} catch (err) {
			next(err);
		}
	}

	static async userStats(req: IRequest, res: Response, next: NextFunction) {
		try {
			const data = await mainService.getUserStats(req.user!._id);
			res.status(httpStatus.OK).json({ status: httpStatus.OK, message: 'Get user status successfully', success: true, data });
		} catch (err) {
			next(err);
		}
	}

	static async projectProgress(req: IRequest, res: Response, next: NextFunction) {
		try {
			const data = await mainService.getProjectProgress(req.user._id);
			res.status(httpStatus.OK).json({ status: httpStatus.OK, message: 'Get project progress report successfully', success: true, data });
		} catch (err) {
			next(err);
		}
	}
}
