import Joi from 'joi';

const getTaskList = {
	body: Joi.object({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(100).default(10),
		sortBy: {
			name: Joi.string().valid('title', 'createdAt').default('createdAt'),
			order: Joi.string().valid('asc', 'desc').default('asc'),
		},
		filter: Joi.object({
			title: Joi.string().max(100).optional(),
			status: Joi.string().valid('Todo', 'In Progress', 'Completed').optional(),
		}).optional().default({}),
	})
}
const createTask = {
	params: Joi.object({
		projectId: Joi.string().hex().length(24).required(),
	}),
	body: Joi.object({
		title: Joi.string().max(100).required(),
		description: Joi.string().max(500).optional(),
		assignedTo: Joi.string().hex().length(24).required(),
		dueDate: Joi.date().optional(),
	})
}
const getTask = {
	params: Joi.object({
		taskId: Joi.string().hex().length(24).required(),
	})
}

const removeTask = {
	params: Joi.object({
		taskId: Joi.string().hex().length(24).required(),
	})
}

const updateTaskStatus = {
	params: Joi.object({
		taskId: Joi.string().hex().length(24).required(),
	}),
	body: Joi.object({
		status: Joi.string().valid('todo', 'in-progress', 'completed').required(),
	})
}

const getUserTasks = {
	params: Joi.object({
		userId: Joi.string().hex().length(24).required(),
	})
}


export {
	getTaskList,
	getTask,
	removeTask,
	createTask,
	updateTaskStatus,
	getUserTasks
}