import Joi from 'joi';
import { ROLE, FIELDNAME, STATUS } from '../types/enums';

import { email, username, password } from '../types/schemas';

// GET api/v1/users
const listUsers = {
	body: Joi.object({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(100).default(10),
		sortBy: {
			name: Joi.string().valid('title', 'createdAt').default('createdAt'),
			order: Joi.string().valid('asc', 'desc').default('asc'),
		},
		filter: Joi.object({
			username: username(),
			email: email(),
			role: Joi.any().valid('admin', 'member'),
		}).optional().default({}),
	})
}

// GET api/v1/users/userId
const getUser = {
	params: Joi.object({
		userId: Joi.string().hex().length(24).required(),
	})
};

// POST api/v1/users
const createUser = {
	body: Joi.object({
		username: username().required(),
		email: email().required(),
		password: password('user').required(),
		role: Joi.string().valid('admin', 'member').optional(),
	})
};

// PUT api/v1/users/:userId
const replaceUser = {
	params: Joi.object({
		userId: Joi.string().hex().length(24).required(),
	}),
	body: Joi.object({
		username: username().required(),
		email: email().required(),
		password: password('user').required(),
		role: Joi.string().valid('admin', 'member').optional(),
	})
};

// PATCH api/v1/users/:userId
const updateUser = {
	params: Joi.object({
		userId: Joi.string().hex().length(24).required(),
	}),
	body: Joi.object({
		username: username(),
		email: email(),
		isUpdatePassword: Joi.boolean().optional(),
		password: password('user'),
		passwordConfirmation: Joi.when('password', {
			is: password('user').required(),
			then: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' }),
			otherwise: Joi.optional()
		}),
		passwordToRevoke: Joi.when('isUpdatePassword', {
			is: Joi.any().equal(true).required(),
			then: password('user').required(),
			otherwise: Joi.optional()
		}),
		role: Joi.string().valid('admin', 'member').optional(),
	})
};

// DELETE api/v1/users/:userId
const removeUser = {
	params: Joi.object({
		userId: Joi.string().hex().length(24).required(),
	})
};

export {
	listUsers,
	getUser,
	createUser,
	replaceUser,
	updateUser,
	removeUser
};