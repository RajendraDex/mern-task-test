import { RequestHandler } from 'express';
import { Router } from '../../types/classes';
import { Validator } from '../../middlewares/validator.middleware';
import { authGuard } from '../../middlewares/guard.middleware';
import { AuthController } from '../../controllers/auth.controller';
import { register, login, refresh, oauthCb, confirm, requestPassword } from '../../validations/auth.validation';
import { ROLE } from '../../types/enums';

export class AuthRouter extends Router {

	constructor() {
		super();
	}

	/**
	 * @description Plug routes definitions
	 */
	define(): void {

		/**
		 * @api {post} /auth/register Register
		 * @apiDescription Register a new user.
		 * @apiVersion 1.0.0
		 * @apiName Register
		 * @apiGroup Auth
		 * @apiPermission public
		 *
		 * @apiUse BaseHeaderSimple
		 *
		 * @apiParam {String{..32}}      username  User username
		 * @apiParam {String}            email     User email address
		 * @apiParam {String{8..16}}     password  User password
		 *
		 * @apiParamExample {json} Payload example
		 * {
		 *    "username": "john-doe",
		 *    "email": "contact@john-doe.com",
		 *    "password": "lo1Rs9#q"
		 * }
		 *
		 * @apiUse SuccessTokenWithUser
		 *
		 * @apiError (400 Bad Request)   InvalidUsername Usernamee is required as alphanumeric string of 32 characters max.
		 * @apiError (400 Bad Request)   InvalidEmail Email is required as valid email address.
		 * @apiError (400 Bad Request)   InvalidPassword Password is required and must have length between 8 and 16 characters.
		 * @apiUse BadRequest
		 *
		 * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
		 * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
		 * @apiUse NotAcceptable
		 *
		 * @apiError (409 Conflict) MySQLError Some parameters are already presents in database (username or email)
		 * @apiUse Conflict
		 *
		 * @apiError (422 Unprocessable Entity) CorruptedUser Given user is not an instance of user.
		 * @apiError (422 Unprocessable Entity) LostAccessToken Access token cannot be retrieved.
		 * @apiUse UnprocessableEntity
		 *
		 */
		this.router
			.route('/register')
			.post(Validator.check(register), AuthController.register);

		this.router
			.route('/login')
			.post(Validator.check(login), AuthController.login);
		this.router
			.route('/me')
			.get(authGuard.authenticate, AuthController.getCurrentUser);
		/**
		 * @api {post} /auth/logout Logout
		 * @apiDescription Logout current user by refresh token revoke.
		 * @apiVersion 1.0.0
		 * @apiName Logout
		 * @apiGroup Auth
		 * @apiPermission user
		 *
		 * @apiUse BaseHeaderSimple
		 *
		 * @apiSuccess (200 OK) / User disconnected
		 * @apiSuccessExample {json} Success response example
		 *  HTTP/1.1 200 OK
		 *
		 * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
		 * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
		 * @apiUse NotAcceptable
		 *
		 * @apiError (422 Unprocessable Entity)  User  Given user is not an instance of user.
		 * @apiUse UnprocessableEntity
		 */
		this.router
			.route('/logout')
			.post(authGuard.authenticate, authGuard.authorize([ROLE.admin, ROLE.member]), AuthController.logout);

		// /**
		//  * @api {patch} /auth/confirm Confirm account
		//  * @apiDescription Confirm account by email address verifying.
		//  * @apiVersion 1.0.0
		//  * @apiName Confirm
		//  * @apiGroup Auth
		//  * @apiPermission public
		//  *
		//  * @apiUse BaseHeaderSimple
		//  *
		//  * @apiParam  {String}  token  Json Web Token
		//  * @apiParamExample {json} Payload example
		//  * {
		//  *    "token": "$2b$10$sYFWFtKOR1QKm8/z6TxhQOgXCxvpZ.L13Xv3Lx496rH.L.EhobhJS"
		//  * }
		//  *
		//  * @apiUse SuccessTokenWithUser
		//  *
		//  * @apiError (400 Bad Request)  ValidationError Token must be a valid token.
		//  * @apiError (400 Bad Request)  BusinessError User status cannot be set to CONFIRMED because is not set to REGISTERED.
		//  * @apiUse BadRequest
		//  *
		//  * @apiError (Unauthorized 401)  Unauthorized Invalid Json Web Token.
		//  * @apiUse Unauthorized
		//  *
		//  * @apiError (Not Found 404)  UserNotFound User cannot be retrieved from given JWT.
		//  * @apiUse NotFound
		//  *
		//  * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
		//  * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
		//  * @apiUse NotAcceptable
		//  */
		// this.router
		// 	.route('/confirm')
		// 	.patch(Validator.check(confirm), AuthController.confirm);

		// /**
		//  * @api {get} /auth/request-password?email=:email Request password
		//  * @apiDescription Request a lost or forgotten password.
		//  * @apiVersion 1.0.0
		//  * @apiName RequestPassword
		//  * @apiGroup Auth
		//  * @apiPermission public
		//  *
		//  * @apiUse BaseHeaderSimple
		//  *
		//  * @apiParam {String} email User email address
		//  * @apiParamExample {string} Param example
		//  *  email=john.doe@website.com
		//  *
		//  * @apiSuccess (200 OK) / Password successfuly requested.
		//  * @apiSuccessExample {json} Success response example
		//  *  HTTP/1.1 200 OK
		//  *
		//  * @apiError (400 Bad Request)  ValidationError Email must be a valid email address.
		//  * @apiUse BadRequest
		//  *
		//  * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
		//  * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
		//  * @apiUse NotAcceptable
		//  */
		// this.router
		// 	.route('/request-password')
		// 	.get(Validator.check(requestPassword), AuthController.requestPassword);

		// /**
		//  * @api {post} /auth/refresh-token Refresh token
		//  * @apiDescription Refresh expired accessToken.
		//  * @apiVersion 1.0.0
		//  * @apiName RefreshToken
		//  * @apiGroup Auth
		//  * @apiPermission public
		//  *
		//  * @apiUse BaseHeaderSimple
		//  *
		//  * @apiParam  {Object}  token               Main token aquired when user logged in
		//  * @apiParam  {string}  token.refreshToken  Refresh token
		//  *
		//  * @apiParamExample {json} Payload example
		//  * {
		//  *    "token": {
		//  *      "refreshToken": "1.6df01971a1ce4dbe4b8752963e50b61632db5685e9c5c9dccedd93ec04b46cf25f40799dedeb926f"
		//  *    }
		//  * }
		//  *
		//  * @apiUse SuccessToken
		//  *
		//  * @apiError (400 Bad Request)  ValidationError  Refresh token must be a valid token.
		//  * @apiUse BadRequest
		//  *
		//  * @apiError (401 Unauthorized)  InvalidPassword  Password must match to authorize a token generating.
		//  * @apiError (401 Unauthorized)  InvalidToken     Invalid or revoked refresh token.
		//  * @apiUse Unauthorized
		//  *
		//  * @apiError (404 Not Found)  NotFound  Refresh token not found.
		//  * @apiUse NotFound
		//  *
		//  * @apiError (406 Not Acceptable)  Content-Type Content-Type header must be "application/json".
		//  * @apiError (406 Not Acceptable)  Origin Origin header must be "https://*".
		//  * @apiUse NotAcceptable
		//  */
		// this.router
		// 	.route('/refresh-token')
		// 	.post(Validator.check(refresh), AuthController.refresh);
	}
}