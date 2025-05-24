import { Schema, Document, Types } from 'mongoose';

export interface IProject extends Document {
	name: string;
	description: string;
	owner: Schema.Types.ObjectId;
	members: Types.ObjectId[] | Schema.Types.ObjectId[];
	status: 'active' | 'archived';
	createdAt: Date;
	updatedAt: Date;
}