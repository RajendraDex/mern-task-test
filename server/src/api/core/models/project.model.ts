import { Document, Schema, model } from 'mongoose';
import { IProject } from './interfaces';


const projectSchema = new Schema<IProject>({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User', required: true
	},
	members: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	status: {
		type: String,
		enum: ['active', 'archived'],
		default: 'active'
	}
}, { timestamps: true });

export const Project = model<IProject>('Project', projectSchema);