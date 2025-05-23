import { Router } from 'express';

import { IRoute } from '../../types/interfaces';

// import { MainRouter } from './main.route';
import { AuthRouter } from './auth.route';
// import { MediaRouter } from './media.route';
// import { UserRouter } from './user.route';

/**
 * Load all application routes and plug it on main router
 */
class ProxyRouter {

	/**
	 * @description Wrapper Express.Router
	 */
	private static instance: ProxyRouter;

	/**
	 * @decription
	 */
	private router: Router = Router();

	/**
	 * @description Routes descriptions
	 */
	private readonly routes: Array<{ segment: string, provider: any }> = [
		// { segment: '', provider: MainRouter },
		{ segment: '/auth/', provider: AuthRouter },
		// { segment: '/medias/', provider: MediaRouter },
		// { segment: '/users/', provider: UserRouter },
		// { segment: '/project/', provider: UserRouter },
		// { segment: '/task/', provider: UserRouter }
	];

	private constructor() { }

	/**
	 * @description
	 */
	static get(): ProxyRouter {
		if (!ProxyRouter.instance) {
			ProxyRouter.instance = new ProxyRouter();
		}
		return ProxyRouter.instance;
	}

	/**
	 * @description Plug sub routes on main router
	 */
	map(): Router {
		this.routes.forEach((route: IRoute) => {
			const instance = new route.provider() as { router: Router };
			this.router.use(route.segment, instance.router);
		});
		return this.router;
	}
}

const proxyRouter = ProxyRouter.get();

export { proxyRouter as ProxyRouter }