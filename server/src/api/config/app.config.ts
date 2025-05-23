import express, { Application, RequestHandler } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
import { CorsOptions } from 'cors';

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
		// Body parser middleware
		this.application.use(express.json({ limit: '10kb' }));
		this.application.use(express.urlencoded({ extended: true, limit: '10kb' }));

		// Set security HTTP headers
		this.application.use(helmet());

		// Enable CORS with configuration
		const corsOptions: CorsOptions = {
			origin: process.env.NODE_ENV === 'production'
				? ['https://your-production-domain.com']
				: ['http://localhost:3000'],
			credentials: true,
			optionsSuccessStatus: 200
		};
		this.application.use(cors(corsOptions));

		// Compress responses
		this.application.use(compression());

		// Rate limiting
		const limiter = rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100, // limit each IP to 100 requests per windowMs
			message: 'Too many requests from this IP, please try again later'
		});
		this.application.use('/api', limiter);

		//* Prevent parameter pollution
		this.application.use(hpp());

		//* Data sanitization against NoSQL query injection
		this.application.use(mongoSanitize());

		//* Data sanitization against XSS
		// this.application.use(xss());

		//* Security headers middleware
		this.application.use(this.securityHeadersMiddleware());

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