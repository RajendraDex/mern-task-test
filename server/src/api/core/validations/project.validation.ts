import { filter } from 'compression';
import Joi from 'joi';

const projectList = {
	body: Joi.object({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(100).default(10),
		sortBy: {
			name: Joi.string().valid('name', 'createdAt').default('createdAt'),
			order: Joi.string().valid('asc', 'desc').default('asc'),
		},
		filter: Joi.object({
			name: Joi.string().max(100).optional(),
			status: Joi.string().valid('active', 'archived').optional(),
		}).optional().default({}),
	})
}

const createProject = {
	body: Joi.object({
		name: Joi.string().max(100).required(),
		description: Joi.string().max(500).optional(),
	})
}

const updateProject = {
	params: Joi.object({
		projectId: Joi.string().hex().length(24).required(),
	}),
	body: Joi.object({
		name: Joi.string().max(100).optional(),
		description: Joi.string().max(500).optional(),
	})
}

const getProject = {
	params: Joi.object({
		projectId: Joi.string().hex().length(24).required(),
	})
};

const removeProject = {
	params: Joi.object({
		projectId: Joi.string().hex().length(24).required(),
	})
};

const getProjectList = {
	body: Joi.object({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(100).default(10),
		sortBy: {
			name: Joi.string().valid('name', 'createdAt').default('createdAt'),
			order: Joi.string().valid('asc', 'desc').default('asc'),
		},
		filter: Joi.object({
			name: Joi.string().max(100).optional(),
		}).optional().default({}),
	})
}

const assignMembers = {
	params: Joi.object({
		projectId: Joi.string().hex().length(24).required(),
	}),
	body: Joi.object({
		members: Joi.array()
			.items(Joi.string().hex().length(24))
			.min(1)
			.required(),
	})
}

const getProjectMembers = {
	params: Joi.object({
		id: Joi.string().hex().length(24).required(),
	})
};

const removeMembers = {
	params: Joi.object({
		projectId: Joi.string().hex().length(24).required(),
	}),
	body: Joi.object({
		members: Joi.array()
			.items(Joi.string().hex().length(24))
			.min(1)
			.required(),
	})
}


export {
	projectList,
	createProject,
	updateProject,
	getProject,
	removeProject,
	getProjectList,
	assignMembers,
	getProjectMembers,
	removeMembers
}

