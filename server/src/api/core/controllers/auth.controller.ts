import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { authService } from '../services/auth.service';
import { email } from '../types/schemas';
import { ObjectId } from 'mongoose';

import { IRequest } from '../types/interfaces';

/**
 * Manage incoming requests from api/{version}/auth
 */
class AuthController {

	/**
	 * @description
	 */
	private static instance: AuthController;

	private constructor() { }

	/**
	 * @description
	 */
	static get(): AuthController {
		if (!AuthController.instance) {
			AuthController.instance = new AuthController();
		}
		return AuthController.instance;
	}

	/**
	 * @description Creates and save new user
	 *
	 * @param req Express request object derived from http.incomingMessage
	 * @param res Express response object
	 */
	async register(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {

			const user = await authService.register(req.body);

			if (!user) {
				res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: 'User registration failed' });
				return;
			}
			const token = await authService.generateTokenResponse(user);

			if (!token) {
				res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: 'Token generation failed' });
				return;
			}

			const newUser = {
				_id: user._id,
				email: user.email,
				username: user.username,
				name: user.username,
				role: user.role
			}
			res.status(201).json(
				{
					status: httpStatus.CREATED,
					message: 'User registered successfully',
					data: { token, user: newUser }
				}
			)
		} catch (e) {
			next(e);
		}
	}

	/**
	 * @description Login with an existing user or creates a new one if valid accessToken token
	 *
	 * @param req Express request object derived from http.incomingMessage
	 * @param res Express response object
	 */
	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;
			const user = await authService.login(email, password);

			if (!user) {
				res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.UNAUTHORIZED, message: 'Invalid credentials' });
				return;
			}
			const token = await authService.generateTokenResponse(user);

			if (!token) {
				res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: 'Token generation failed' });
				return;
			}
			res.status(200).json(
				{
					status: httpStatus.OK,
					message: 'User logged in',
					data: {
						token,
						user: {
							_id: user._id,
							email: user.email,
							username: user.username,
							name: user.username,
							role: user.role
						}
					}
				}
			)
		} catch (e) {
			next(e);
		}
	}


	async logout(req: IRequest, res: Response): Promise<void> {
		const userId = req.user._id as ObjectId;
		await authService.revokeRefreshToken(userId);
		res.status(httpStatus.OK).json({ status: httpStatus.OK, message: 'User logged out' });
	}

	// /**
	//  * @description Login with an existing user or creates a new one if valid accessToken token
	//  *
	//  * @param req Express request object derived from http.incomingMessage
	//  * @param res Express response object
	//  */
	// @Safe()
	// async oAuth(req: IUserRequest, res: IResponse): Promise<void> {
	// 	const user = req.user as User;
	// 	const accessToken = user.token();
	// 	const token = await AuthService.generateTokenResponse(user, accessToken);
	// 	res.locals.data = { token, user };
	// }

	// /**
	//  * @description Refresh JWT access token by RefreshToken removing, and re-creating
	//  *
	//  * @param req Express request object derived from http.incomingMessage
	//  * @param res Express response object
	//  */
	// @Safe()
	// async refresh(req: Request, res: IResponse, next: (e?: Error) => void): Promise<void> {
	// 	const refreshTokenRepository = ApplicationDataSource.getRepository(RefreshToken);

	// 	const { token } = req.body as { token: { refreshToken?: string } };

	// 	const refreshToken = await refreshTokenRepository.findOne({
	// 		where: { token: token.refreshToken }
	// 	});

	// 	if (typeof (refreshToken) === 'undefined') {
	// 		return next(notFound('RefreshToken not found'));
	// 	}

	// 	await refreshTokenRepository.remove(refreshToken);

	// 	// Get owner user of the token
	// 	const { user, accessToken } = await UserRepository.findAndGenerateToken({ email: refreshToken.user.email, refreshToken });
	// 	const response = await AuthService.generateTokenResponse(user, accessToken);

	// 	res.locals.data = { token: response };
	// }

	// /**
	//  * @description Confirm email address of a registered user
	//  *
	//  * @param req Express request object derived from http.incomingMessage
	//  * @param res Express response object
	//  *
	//  * @fixme token should be temp: 24h
	//  */
	// @Safe()
	// async confirm(req: IUserRequest, res: IResponse): Promise<void> {

	// 	const repository = ApplicationDataSource.getRepository(User);

	// 	const decoded = Jwt.decode(req.body.token, ACCESS_TOKEN.SECRET) as { sub };
	// 	if (!decoded) {
	// 		throw badRequest('User token cannot be read');
	// 	}

	// 	const user = await repository.findOneOrFail({ where: { id: decoded.sub } });

	// 	if (user.status !== STATUS.REGISTERED && user.status !== STATUS.REVIEWED) {
	// 		throw badRequest('User status cannot be confirmed');
	// 	}

	// 	user.status = STATUS.CONFIRMED;

	// 	await repository.save(user);

	// 	const token = await AuthService.generateTokenResponse(user, user.token());
	// 	res.locals.data = { token, user };
	// }

	// /**
	//  * @description Request a temporary token to change password
	//  *
	//  * @param req Express request object derived from http.incomingMessage
	//  * @param res Express response object
	//  */
	// @Safe()
	// async requestPassword(req: IUserRequest, res: IResponse): Promise<void> {

	// 	const repository = ApplicationDataSource.getRepository(User);

	// 	const user = await repository.findOne({ where: { email: req.query.email } });

	// 	if (user && user.status === STATUS.CONFIRMED) {
	// 		void AuthService.revokeRefreshToken(user);
	// 		EmailEmitter.emit('password.request', user);
	// 	}

	// 	res.locals.data = {};
	// }
}

const authController = AuthController.get();

export { authController as AuthController }