import { User, } from '../models/user.model';
import { IToken, IUser } from '../models/interfaces';
import { userService } from './user.service';
import { tokenService } from './token.service';
import { ROLE } from '../types/enums/role.enum';
import { ApiError } from '../utils/apiError.util';
import httpStatus from 'http-status';
import { ObjectId } from 'mongoose';
import { toObjectId } from '../utils/mogoose.util';


class AuthService {

	userService = userService;
	tokenService = tokenService;

	constructor() { }

	async register(userData: IUser): Promise<IUser | null> {
		const count = await this.count();

		if (!userData.role) {
			userData.role = ROLE.member;
			if (count === 0) {
				userData.role = ROLE.admin;
			}
		}
		const isExistEmail = await this.userService.getUserByEmail(userData.email);


		if (isExistEmail) {
			throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
		}
		const isUserNameExist = await this.userService.getUserByUsername(userData.username);

		if (isUserNameExist) {
			throw new ApiError(httpStatus.CONFLICT, 'Username already exists');
		}
		const user = await this.userService.createUser(userData);
		return user;
	}

	async count(): Promise<number> {
		try {
			const userCount = await User.countDocuments();
			return userCount;
		} catch (e) {
			return 0;
		}
	}

	async generateTokenResponse(user: IUser | null): Promise<Record<string, any> | null> {
		try {
			if (!user) {
				return null;
			}
			const tokens = await this.tokenService.generateAuthTokens(user);
			return tokens;
		} catch (e) {
			return null;
		}
	}

	async login(email: string, password: string): Promise<IUser> {
		const user = await User.findOne({ email });
		if (!user || !user.comparePassword(password)) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
		}

		return user;
	}

	async revokeRefreshToken(userId: ObjectId): Promise<void> {
		await this.tokenService.removeToken(userId);
	}

	async getById(id: string): Promise<Partial<IUser>> {

		const user = await User.findById(toObjectId(id)).select('-password');
		if(!user) {
           throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		}
		return user;
	}

}


const authService = new AuthService();
export { authService };