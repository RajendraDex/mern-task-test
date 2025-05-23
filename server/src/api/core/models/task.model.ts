import { Document, Schema, model } from 'mongoose';

import { ITask } from './interfaces';

const taskSchema = new Schema<ITask>({
	title: { type: String, required: true },
	description: { type: String },
	project: {
		type: Schema.Types.ObjectId,
		ref: 'Project', required: true
	},
	assignedTo: {
		type: Schema.Types.ObjectId,
		ref: 'User', required: true
	},
	assignee: {
		type: Schema.Types.ObjectId,
		ref: 'User', required: true
	},
	status: {
		type: String,
		enum: ['todo', 'in-progress', 'completed'],
		default: 'todo'
	},
	dueDate: { type: Date }
},
	{ timestamps: true });

export const Task = model<ITask>('Task', taskSchema);