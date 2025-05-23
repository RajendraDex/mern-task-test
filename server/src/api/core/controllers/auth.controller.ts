import { Request, Response } from 'express';

import { authService } from '../services/auth.service';
enum ROLE {
	admin = 'admin',
	member = 'member',
	guest = 'guest',
}

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
	async register(req: Request, res: Response): Promise<void> {
		try {
			const count = await authService.count();

			if (!req.body.role) {
				req.body.role = ROLE.member;
				if (count === 0) {
					req.body.role = ROLE.admin;
				}
			}

			const user = await authService.register(req.body);

			if (!user) {
				res.status(400).json({ status: 'error', message: 'User registration failed' });
				return;
			}
			const token = await authService.generateTokenResponse(user);

			if (!token) {
				res.status(400).json({ status: 'error', message: 'Token generation failed' });
				return;
			}
			res.status(201).json(
				{
					status: 'ok',
					message: 'User created',
					data: { token, user }
				}
			)
		} catch (e) {
			console.error('Error in register:', e);
			res.status(500).json({ status: 'error', message: 'Internal server error' });
		}
	}

	// /**
	//  * @description Login with an existing user or creates a new one if valid accessToken token
	//  *
	//  * @param req Express request object derived from http.incomingMessage
	//  * @param res Express response object
	//  */
	// @Safe()
	// async login(req: Request, res: IResponse): Promise<void> {
	// 	const { user, accessToken } = await UserRepository.findAndGenerateToken(req.body as ITokenOptions);
	// 	const token = await AuthService.generateTokenResponse(user, accessToken);
	// 	res.locals.data = { token, user };
	// }

	// /**
	//  * @description Logout user
	//  *
	//  * @param req Express request object derived from http.incomingMessage
	//  * @param res Express response object
	//  */
	// @Safe()
	// async logout(req: IUserRequest, res: IResponse): Promise<void> {
	// 	await AuthService.revokeRefreshToken(req.user as User);
	// 	res.locals.data = null;
	// }

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