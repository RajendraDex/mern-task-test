import { Schema, Document } from 'mongoose';

export interface IProject extends Document {
	name: string;
	description: string;
	owner: Schema.Types.ObjectId;
	members: Schema.Types.ObjectId[];
	status: 'active' | 'archived';
	createdAt: Date;
	updatedAt: Date;
}