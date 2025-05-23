import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import { Token } from '../models';
import { Mongoose, ObjectId } from 'mongoose';
import { IUser, IToken } from '../models/interfaces';
import { JWT } from '../../config/environment.config';

import { userService } from '../services/user.service';

class TokenService {

	constructor() { }

	generateToken(userId: ObjectId, expires: Moment, secret: string = JWT.JWT_SECRET): string {
		const payload = {
			sub: userId,
			iat: moment().unix(),
			exp: expires.unix(),
		};
		return jwt.sign(payload, secret);
	}

	async saveToken(token: string, userId: ObjectId, expires: Moment, type: string, blacklisted: boolean = false): Promise<IToken> {
		return Token.create({
			token,
			user: userId,
			expires: expires.toDate(),
			type,
			blacklisted,
		});
	}

	async verifyToken(token: string, type: string): Promise<IToken> {
		const tokenDoc = await Token.findOne({ token, type, blacklisted: false });
		if (!tokenDoc) {
			throw new Error('Token not found');
		}
		return tokenDoc;
	}

	async generateAuthTokens(user: IUser): Promise<{
		access: { token: string; expires: Date };
		refresh: { token: string; expires: Date };
	}> {
		const userId = user._id as ObjectId;
		const accessTokenExpires = moment().add(JWT.ACCESS_TOKEN_EXPIRES_IN, 'minutes');
		const accessToken = this.generateToken(userId, accessTokenExpires);

		const refreshTokenExpires = moment().add(JWT.REFRESH_TOKEN_EXPIRES_IN, 'days');
		const refreshToken = this.generateToken(userId, refreshTokenExpires);
		await this.saveToken(refreshToken, userId, refreshTokenExpires, 'refresh');

		return {
			access: {
				token: accessToken,
				expires: accessTokenExpires.toDate(),
			},
			refresh: {
				token: refreshToken,
				expires: refreshTokenExpires.toDate(),
			},
		};
	}

	async generateResetPasswordToken(email: string): Promise<string> {
		const user = await userService.getUserByEmail(email) as IUser;
		if (!user) {
			// throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
		}
		const expires = moment().add(JWT.RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
		const userId = user._id as ObjectId;
		const resetPasswordToken = this.generateToken(userId, expires);
		await this.saveToken(resetPasswordToken, userId, expires, 'resetPassword');
		return resetPasswordToken;
	}

	async removeToken(userId: ObjectId): Promise<void> {
		const token = await Token.findOne({ user: userId });
		if (token) {
			await token.deleteOne();
		}
	}

	async checkToken(userId: ObjectId): Promise<void> {
		const token = await Token.findOne({ user: userId });
		if (!token) {
			// throw new ApiError(httpStatus.NOT_FOUND, Message.tokenNotFound);
		}
		const user = await userService.getUserById(userId);
		if (!user) {
			// throw new ApiError(httpStatus.NOT_FOUND, Message.userNotFound);
		}
		// if (user.status === false) {
		// 	// throw new ApiError(httpStatus.NOT_FOUND, Message.loginBlocked);
		// }
	}
}

const tokenService = new TokenService();
export { tokenService };