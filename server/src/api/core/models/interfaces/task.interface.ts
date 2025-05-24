import { Schema, Document } from 'mongoose';

export interface ITask extends Document {
	title: string;
	description: string;
	project: Schema.Types.ObjectId;
	assignedTo: Schema.Types.ObjectId;
	assignee: Schema.Types.ObjectId;
	status: 'todo' | 'in-progress' | 'completed';
	dueDate?: Date;
	createdAt: Date;
	updatedAt: Date;
}