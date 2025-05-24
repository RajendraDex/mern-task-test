import { Router } from '../../types/classes';
import { authGuard } from '../../middlewares/guard.middleware';
import { Validator } from '../../middlewares/validator.middleware';
import { ProjectController } from '../../controllers/project.controller';
import { projectList, createProject, updateProject, assignMembers, removeMembers, getProject, getProjectMembers } from '../../validations/project.validation';
import { ROLE } from '../../types/enums';

export class ProjectRouter extends Router {

	constructor() {
		super();
	}

	define(): void {
		/**
		 * @api {post} /projects list Project
		 * @apiGroup Projects
		 * @apiPermission authenticated
		 */
		this.router
			.route('/list')
			.post(authGuard.authenticate, Validator.check(projectList), ProjectController.getProjectList);
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
			.route('/:projectId')
			.put(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin, ROLE.member]),
				Validator.check(updateProject),
				ProjectController.update
			);
		this.router
			.route('/:projectId')
			.get(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin, ROLE.member]),
				Validator.check(getProject),
				ProjectController.getProject
			);

		/**
		 * @api {delete} /projects/:id Delete Project
		 * @apiGroup Projects
		 * @apiPermission projectOwner
		 */
		this.router
			.route('/:projectId')
			.delete(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin, ROLE.member]),
				ProjectController.remove
			);

		/**
		 * @api {post} /project/add-project-member/:id Assign Members
		 * @apiGroup Projects
		 * @apiPermission projectOwner
		 */
		this.router
			.route('/add-project-member/:projectId')
			.post(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin, ROLE.member]),
				Validator.check(assignMembers),
				ProjectController.assignMembers
			);
		/**
		 * @api {post} /project/remove-project-member/:id remove Members
		 * @apiGroup Projects
		 * @apiPermission projectOwner
		 */
		this.router
			.route('/remove-project-member/:projectId')
			.post(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin, ROLE.member]),
				Validator.check(removeMembers),
				ProjectController.removeMembers
			);
		/**
		 * @api {post} /project/remove-project-member/:id remove Members
		 * @apiGroup Projects
		 * @apiPermission projectOwner
		 */
		this.router
			.route('/get-project-team/:projectId')
			.get(
				authGuard.authenticate,
				authGuard.authorize([ROLE.admin, ROLE.member]),
				Validator.check(getProjectMembers),
				ProjectController.getProjectMembers
			);
	}
}