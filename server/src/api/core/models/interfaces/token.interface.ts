import { Document, Types } from 'mongoose';

export interface IToken extends Document {
	token: string;
	user: Types.ObjectId;
	type: 'refresh' | 'resetPassword';
	expires: Date;
	blacklisted: boolean;
	createdAt: Date;
	updatedAt: Date;
}