import { Router } from '../../types/classes';
import { authGuard } from '../../middlewares/guard.middleware';
import { Validator } from '../../middlewares/validator.middleware';
import { UserController } from '../../controllers/user.controller';
import {
	createUser,
	updateUser,
	replaceUser,
	getUser,
	listUsers
} from '../../validations/user.validation';

export class UserRouter extends Router {
	constructor() {
		super();
	}

	define(): void {
		/**
		 * @api {get} /users List all users
		 * @apiGroup Users
		 * @apiPermission authenticated
		 */
		this.router
			.route('/list')
			.post(
				authGuard.authenticate,
				Validator.check(listUsers),
				UserController.listUsers
			);

		/**
		 * @api {get} /users/:userId Get single user
		 * @apiGroup Users
		 * @apiPermission authenticated
		 */
		this.router
			.route('profile/:userId')
			.get(
				authGuard.authenticate,
				Validator.check(getUser),
				UserController.getUser
			);

		/**
		 * @api {post} /users Create new user
		 * @apiGroup Users
		 * @apiPermission authenticated
		 */
		this.router
			.route('/create')
			.post(
				authGuard.authenticate,
				Validator.check(createUser),
				UserController.createUser
			);

		/**
		 * @api {put} /users/:userId Replace a user
		 * @apiGroup Users
		 * @apiPermission authenticated
		 */
		this.router
			.route('/replace/:userId')
			.put(
				authGuard.authenticate,
				Validator.check(replaceUser),
				UserController.replaceUser
			);

		/**
		 * @api {patch} /users/:userId Update partial user data
		 * @apiGroup Users
		 * @apiPermission authenticated
		 */
		this.router
			.route('/update/:userId')
			.patch(
				authGuard.authenticate,
				Validator.check(updateUser),
				UserController.updateUser
			);

		/**
		 * @api {delete} /users/:userId Delete a user
		 * @apiGroup Users
		 * @apiPermission authenticated
		 */
		this.router
			.route('/delete/:userId')
			.delete(
				authGuard.authenticate,
				UserController.removeUser
			);
	}
}