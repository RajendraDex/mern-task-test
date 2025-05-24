import { Schema, Document, Types } from 'mongoose';

export interface ITeamMember {
	_id: Schema.Types.ObjectId
	username: string;
	email: string;
	role: string
}

export interface IProject extends Document {
	_id: Schema.Types.ObjectId;
	name: string;
	description: string;
	owner: Schema.Types.ObjectId;
	members: Types.ObjectId[] | Schema.Types.ObjectId[];
	status: 'active' | 'archived';
	createdAt: Date;
	updatedAt: Date;
}