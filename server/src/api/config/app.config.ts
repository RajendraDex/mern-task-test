import express, { Application, RequestHandler } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
import { CorsOptions } from 'cors';

import { ProxyRouter } from '../core/routes/v1';
import { apiMiddleware } from '../core/middlewares/api.middleware';

import { API_VERSION } from './environment.config';
import { errorConverter, errorHandler } from '../core/utils/errorHandler.util';

class ExpressConfiguration {
	private static instance: ExpressConfiguration;
	application!: Application;

	private constructor() {
	}

	init(): ExpressConfiguration {
		if (!this.application) {
			this.application = express();
		}
		return this;
	}
	// init(): void {
	// 	this.application = express();
	// 	this.initializeMiddlewares();
	// }

	public static getInstance(): ExpressConfiguration {
		if (!ExpressConfiguration.instance) {
			ExpressConfiguration.instance = new ExpressConfiguration();
		}
		return ExpressConfiguration.instance;
	}

	public getApp(): Application {
		return this.application;
	}

	plug(): ExpressConfiguration {
		//* Body parser middleware
		this.application.use(express.json({ limit: '10kb' }));
		this.application.use(express.urlencoded({ extended: true, limit: '10kb' }));

		//* Set security HTTP headers
		this.application.use(helmet());

		//* Enable CORS with configuration
		const corsOptions: CorsOptions = {
			origin: process.env.NODE_ENV === 'production'
				? ['https://your-production-domain.com']
				: ['http://localhost:3000'],
			credentials: true,
			optionsSuccessStatus: 200
		};
		this.application.use(cors(corsOptions));

		//* Compress responses
		this.application.use(compression());

		//* Rate limiting
		const limiter = rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100, // limit each IP to 100 requests per windowMs
			message: 'Too many requests from this IP, please try again later'
		});
		this.application.use('/api', limiter);

		//* Prevent parameter pollution
		this.application.use(hpp());

		this.application.use(apiMiddleware);

		//* Data sanitization against NoSQL query injection
		// this.application.use(mongoSanitize());

		//* Data sanitization against XSS
		// this.application.use(xss());

		//* Security headers middleware
		// this.application.use(this.securityHeadersMiddleware());

		// * routes
		/**
	 * Lifecyle of a classic request
	 *
	 * - RateLimit
	 * - Memory cache
	 * - Router(s)
	 * - Sanitizer
	 * - Resolver
	 */
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		this.application.use(`/api/${API_VERSION}`, limiter, ProxyRouter.map());
		// this.application.use(`/api/${API_VERSION}`, RateLimit(this.options.rate), Cache.read, ProxyRouter.map(), Sanitize.sanitize, Resolve.write);

		/**
		 * Lifecycle of an error request
		 *
		 * - Generate typed error
		 * - Log dirty error
		 * - Output clean HTTP friendly error
		 * - Output clean 404 error
		 */
		// this.application.use(Catch.factory, Catch.log, Catch.exit, Catch.notFound);
		this.application.use((req, res, next) => {
			res.status(404).json({
				status: 404,
				message: 'Not Found'
			});
		});

		this.application.use(errorConverter);
		this.application.use(errorHandler);

		return this;
	}

	private securityHeadersMiddleware(): RequestHandler {
		return (req, res, next) => {
			//* Set additional security headers
			res.setHeader('X-Content-Type-Options', 'nosniff');
			res.setHeader('X-Frame-Options', 'DENY');
			res.setHeader('X-XSS-Protection', '1; mode=block');
			res.setHeader('Referrer-Policy', 'no-referrer');
			res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");

			next();
		};
	}
}

const Application = ExpressConfiguration
	.getInstance()
	.init()
	.plug()
	.application;

export { Application }