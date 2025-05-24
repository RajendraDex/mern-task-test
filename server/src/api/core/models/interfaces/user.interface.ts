
import { Document, Types, Schema } from 'mongoose';

export interface IUser extends Document {
	_id: Schema.Types.ObjectId;
	username: string;
	email: string;
	password: string;
	role: 'admin' | 'member';
	createdAt: Date;
	updatedAt: Date;
	comparePassword(password: string): boolean;
}