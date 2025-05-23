import { User, } from '../models/user.model';
import { IToken, IUser } from '../models/interfaces';
import { userService } from './user.service';
import { tokenService } from './token.service';
import { ObjectId } from 'mongoose';


class AuthService {

	userService = userService;
	tokenService = tokenService;

	constructor() { }

	async register(userData: IUser): Promise<IUser | null> {
		try {
			const isExistEmail = await this.userService.getUserByEmail(userData.email);
			if (isExistEmail) {
				throw new Error('User already exists');
			}
			const user = await this.userService.createUser(userData);
			return user;
		} catch (e) {
			return null;
		}
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


	async login(email: string, password: string): Promise<IUser | null> {
		try {
			const user = await this.userService.getUserByEmail(email)
			// if (!user || !(await user.comparePassword(password))) {
			// 	return null;
			// }
			return user;
		} catch (e) {
			return null;
		}
	}

}


const authService = new AuthService();
export { authService };