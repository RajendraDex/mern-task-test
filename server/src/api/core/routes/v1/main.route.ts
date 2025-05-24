// src/routes/dashboard.router.ts
import { Router } from '../../types/classes';
import { authGuard } from '../../middlewares/guard.middleware';
import { DashboardController } from '../../controllers/main.controller';
import { ROLE } from '../../types/enums';

export class MainRouter extends Router {
	constructor() {
		super();
	}

	define(): void {
		/**
		 * @api {get} /dashboard/stats Get dashboard stats
		 * @apiGroup Dashboard
		 * @apiPermission authenticated
		 */
		this.router
			.route('/stats')
			.get(authGuard.authenticate, DashboardController.stats);

		/**
		 * @api {get} /dashboard/user-stats Get user task stats
		 * @apiGroup Dashboard
		 * @apiPermission authenticated
		 */
		this.router
			.route('/user-stats')
			.get(authGuard.authenticate, DashboardController.userStats);

		/**
		 * @api {get} /dashboard/project-progress Get project progress overview
		 * @apiGroup Dashboard
		 * @apiPermission authenticated
		 */
		this.router
			.route('/project-progress')
			.get(authGuard.authenticate, DashboardController.projectProgress);
	}
}