import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { IRequest } from '../types/interfaces';
import httpStatus from 'http-status';

export class UserController {
	static async listUsers(req: IRequest, res: Response, next: NextFunction) {
		try {
			const { page, limit, filter, sortBy } = req.body;

			const options = {
				page,
				limit,
				filter,
				sortBy
			}
			const users = await userService.list(options);
			res.status(httpStatus.OK).json({
				status: httpStatus.OK,
				message: 'Get users successfully',
				data: users
			});
		} catch (err) {
			next(err);
		}
	}

	static async createUser(req: IRequest, res: Response, next: NextFunction) {
		try {
			const user = await userService.createUser(req.body);
			res.status(httpStatus.CREATED).json({
				status: httpStatus.CREATED,
				message: 'Created user successfully',
				data: user
			});
		} catch (err) {
			next(err);
		}
	}

	static async getUser(req: IRequest, res: Response, next: NextFunction) {
		try {
			const user = await userService.getUserById(req.params.UserId);
			res.status(httpStatus.OK).json({
				status: httpStatus.OK,
				message: 'Get user successfully',
				data: user
			});
		} catch (err) {
			next(err);
		}
	}
	static async replaceUser(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updatedUser = await userService.updateUser(req.params.userId, req.body);
			res.status(httpStatus.OK).json({
				status: httpStatus.OK,
				message: 'Replace user successfully',
				data: updatedUser
			});
		} catch (err) {
			next(err);
		}
	}

	static async updateUser(req: IRequest, res: Response, next: NextFunction) {
		try {
			const updatedUser = await userService.updateUser(req.params.userId, req.body);
			res.status(httpStatus.OK).json({
				status: httpStatus.OK,
				message: 'Updated user successfully',
				data: updatedUser
			});
		} catch (err) {
			next(err);
		}
	}

	static async removeUser(req: IRequest, res: Response, next: NextFunction) {
		try {
			await userService.deleteUser(req.params.userId);
			res.status(httpStatus.NO_CONTENT).end();
		} catch (err) {
			next(err);
		}
	}

}