import { Document, Schema, model, Types } from 'mongoose';

export interface IToken extends Document {
	token: string;
	user: Types.ObjectId;
	type: 'refresh' | 'resetPassword';
	expires: Date;
	blacklisted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const tokenSchema = new Schema<IToken>(
	{
		token: {
			type: String,
			required: true,
			index: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['refresh', 'resetPassword'],
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
		blacklisted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);


const Token = model<IToken>('Token', tokenSchema);

export { Token };