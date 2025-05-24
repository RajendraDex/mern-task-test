import { Schema, Document, Types } from 'mongoose';

interface IAssignedTo {
	username: string;
	_id: Schema.Types.ObjectId;
}
export interface ITask extends Document {
	_id: Schema.Types.ObjectId;
	title: string;
	description: string;
	project: Schema.Types.ObjectId | Types.ObjectId;
	assignedTo: Schema.Types.ObjectId | IAssignedTo;
	assignee: Schema.Types.ObjectId;
	status: 'todo' | 'in-progress' | 'completed';
	priority?: 'low' | 'medium' | 'high';
	dueDate?: Date;
	createdAt: Date;
	updatedAt: Date;
}