// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { JWT, ENV } from '../../config/environment.config';
import { ApiError } from '../utils/apiError.util';
import { User } from '../models/user.model';
import { IUser } from '../models/interfaces';

export interface AuthRequest extends Request {
	user?: IUser;
}

class AuthGuard {
	private static instance: AuthGuard;

	private constructor() { }

	static getInstance(): AuthGuard {
		if (!AuthGuard.instance) {
			AuthGuard.instance = new AuthGuard();
		}
		return AuthGuard.instance;
	}

	async authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'Missing or invalid Authorization header'));
		}

		const token = authHeader.split(' ')[1];
		try {
			const payload = jwt.verify(token, JWT.JWT_SECRET) as { sub: string };
			const user = await User.findById(payload.sub);
			if (!user) {
				return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
			}
			req.user = user;
			next();
		} catch (err) {
			next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
		}
	}

	authorize(roles: string[] = []) {
		return (req: AuthRequest, res: Response, next: NextFunction): void => {
			if (!req.user) {
				return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
			}
			if (!roles.includes(req.user.role)) {
				return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
			}
			next();
		};
	}
}

const authGuard = AuthGuard.getInstance();

export {
	authGuard
}
