import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from './interfaces';

const userSchema = new Schema<IUser>({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['admin', 'member'],
		default: 'member'
	}
}, { timestamps: true });


userSchema.pre<IUser>('save', function (next) {
	if (this.isModified('password')) {
		this.password = bcrypt.hashSync(this.password, 10);
	}
	next();
});

userSchema.methods.comparePassword = function (password: string): boolean {
	return bcrypt.compareSync(password, this.password);
};

export const User = model<IUser>('User', userSchema);