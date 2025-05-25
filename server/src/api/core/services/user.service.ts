import { ObjectId } from 'mongoose';
import { User } from '../models';
import { IUser } from '../models/interfaces'
import { customPagination } from '../utils/pagination.util'
import { ListOptions } from '../types/interfaces';
import { toObjectId } from '../utils/mogoose.util';

class UserService {

	constructor() { }


	async getUserById(userId: ObjectId): Promise<IUser | null> {
		const user = await User.findById(userId);
		if (!user) {
			return null;
		}
		return user;
	}
	async getUserByEmail(email: string): Promise<IUser | null> {
		const user = await User.findOne({ email }).lean().exec();
		if (!user) {
			return null;
		}
		return user;
	}
	async getUserByUsername(username: string): Promise<IUser | null> {
		const user = await User.findOne({ username }).lean().exec();
		if (!user) {
			return null;
		}
		return user;
	}

	async createUser(userData: Partial<IUser>): Promise<IUser> {
		const user = new User(userData);
		await user.save();
		return user;
	}


	async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
		return await User.findByIdAndUpdate(toObjectId(userId), userData, { new: true });
	}

	async deleteUser(userId: string): Promise<boolean> {
		await User.deleteOne({ _id: toObjectId(userId) });
		return true;
	}

	async list(options: ListOptions): Promise<{ results: IUser[]; total: number; page: number; limit: number }> {

		const { page = 1, limit = 10, filter, sortBy } = options;

		const filterObject: Record<string, any> = {
			...filter,
		};

		if (filter.username) filterObject.username = { $regex: filter.username, $options: 'i' };

		const sort: Record<string, 1 | -1> = {};
		if (sortBy?.name) {
			sort[sortBy.name] = sortBy.order === 'asc' ? 1 : -1;
		} else {
			sort['createdAt'] = -1;
		}

		const skip = (page - 1) * limit;
		const [results, total] = await Promise.all([
			User.find(filterObject)
				.skip(skip)
				.limit(limit)
				.sort(sort),
			User.countDocuments(filterObject),
		]);

		const pagination = customPagination(results, page, limit, total);
		return pagination;
	}
}


const userService = new UserService();

export { userService };