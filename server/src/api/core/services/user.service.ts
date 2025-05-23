import { ObjectId } from 'mongoose';
import { User } from '../models';
import { IUser } from '../models/interfaces'

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

	async createUser(userData: IUser): Promise<IUser> {

		console.log("🚀 ---------- user.service.ts:27 ---------- UserService ---------- createUser ---------- userData:", userData);

		const user = new User(userData);

		console.log("🚀 ---------- user.service.ts:31 ---------- UserService ---------- createUser ---------- user:", user);

		await user.save();
		return user;
	}

	// Example method to update an existing user
	async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
		// Implement the logic to update an existing user
		return null; // Placeholder return value
	}

	// Example method to delete a user
	async deleteUser(userId: string): Promise<boolean> {
		// Implement the logic to delete a user
		return true; // Placeholder return value
	}
	// Add your service methods here
}


const userService = new UserService();

export { userService };