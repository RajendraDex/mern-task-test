import { Router } from '../../types/classes';
import { authGuard } from '../../middlewares/guard.middleware';
import { Validator } from '../../middlewares/validator.middleware';
import { ProjectController } from '../../controllers/project.controller';
import { createProject, updateProject } from '../../validations/project.validation';
import { ROLE } from '../../types/enums';

export class ProjectRouter extends Router {

	constructor() {
		super();
	}

	define(): void {
		/**
		 * @api {post} /projects Create Project
		 * @apiGroup Projects
		 * @apiPermission authenticated
		 */
		this.router
			.route('/create')
			.post(authGuard.authenticate, Validator.check(createProject), ProjectController.create);

		/**
		 * @api {put} /projects/:id Update Project
		 * @apiGroup Projects
		 * @apiPermission projectOwner
		 */
		this.router
			.route('/:id')
			.put(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin]),
				Validator.check(updateProject),
				ProjectController.update
			);

		/**
		 * @api {delete} /projects/:id Delete Project
		 * @apiGroup Projects
		 * @apiPermission projectOwner
		 */
		this.router
			.route('/:id')
			.delete(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin]),
				ProjectController.remove
			);

		/**
		 * @api {post} /projects/:id/members Assign Members
		 * @apiGroup Projects
		 * @apiPermission projectOwner
		 */
		this.router
			.route('/:id/members')
			.post(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin]),
				ProjectController.assignMembers
			);
	}
}