import { Router } from '../../types/classes';
import { authGuard } from '../../middlewares/guard.middleware';
import { Validator } from '../../middlewares/validator.middleware';
import { TaskController } from '../../controllers/task.controller';
import { createTask, updateTaskStatus, getUserTasks, getTaskList } from '../../validations/task.validation';
import { ROLE } from '../../types/enums';
import { get } from 'http';

export class TaskRouter extends Router {

	constructor() {
		super();
	}

	define(): void {
		/**
		 * @api {post} /create-projects-task/:projectId Create Task
		 * @apiGroup Tasks
		 * @apiPermission authenticated
		 */
		this.router
			.route('/create')
			.post(
				authGuard.authenticate,
				Validator.check(createTask),
				TaskController.create
			);

		/**
		 * @api {patch} /update-task-status/:taskId Update Task Status
		 * @apiGroup Tasks
		 * @apiPermission taskAssignee
		 */
		this.router
			.route('/update-task-status/:taskId')
			.patch(
				authGuard.authenticate,
				Validator.check(updateTaskStatus),
				TaskController.updateStatus
			);

		/**
		 * @api {get} /users/:userId/tasks Get Tasks by User
		 * @apiGroup Tasks
		 * @apiPermission authenticated
		 */
		this.router
			.route('/get-user-task/:userId')
			.get(
				authGuard.authenticate,
				Validator.check(getUserTasks),
				TaskController.getByUser
			);
		/**
		 * @api {get} /task/list  Get Tasks by projectId
		 * @apiGroup Tasks
		 * @apiPermission authenticated
		 */
		this.router
			.route('/list')
			.post(
				authGuard.authenticate,
				Validator.check(getTaskList),
				TaskController.getTaskList
			);
	}
}