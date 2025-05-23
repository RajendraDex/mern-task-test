// src/config/environment.ts

import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { existsSync, readFileSync } from 'fs';
// import { Logger } from './logger.service';

class EnvironmentConfig {
	private static instance: EnvironmentConfig;
	private envConfig: Record<string, any>;

	private readonly envSchema = Joi.object({
		NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
		PORT: Joi.number().default(4000),
		HOST: Joi.string().default('localhost'),
		SSL_IS_ACTIVE: Joi.boolean().default(false),
		SSL_KEY_PATH: Joi.when('SSL_IS_ACTIVE', {
			is: true,
			then: Joi.string().required(),
			otherwise: Joi.string().optional()
		}),
		SSL_CERT_PATH: Joi.when('SSL_IS_ACTIVE', {
			is: true,
			then: Joi.string().required(),
			otherwise: Joi.string().optional()
		}),
		MONGODB_URI: Joi.string().when('DB_TYPE', {
			is: 'mongodb',
			then: Joi.string().uri().required(),
			otherwise: Joi.string().optional()
		}),
		MONGODB_OPTIONS: Joi.string().default('retryWrites=true&w=majority'),
		JWT_SECRET: Joi.string().required(),
		JWT_EXPIRES_IN: Joi.string().default('1h'),
		CORS_ORIGIN: Joi.string().default('*'),
		RATE_LIMIT_MAX: Joi.number().default(100),
		RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000),
		LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'verbose', 'debug').default('info'),
	}).unknown(true);

	private constructor() {
		const envFile = '.env';

		if (existsSync(envFile)) {
			const envContent = readFileSync(envFile);
			this.envConfig = dotenv.parse(envContent);
		} else {
			// Logger.warn('No .env file found. Using process.env only.');
			this.envConfig = {};
		}

		this.envConfig = {
			...this.envConfig,
			...process.env
		};

		this.validate();
	}

	public static getInstance(): EnvironmentConfig {
		if (!EnvironmentConfig.instance) {
			EnvironmentConfig.instance = new EnvironmentConfig();
		}
		return EnvironmentConfig.instance;
	}

	private validate(): void {
		const { error, value } = this.envSchema.validate(this.envConfig, {
			abortEarly: false,
			convert: true
		});

		if (error) {
			const errorMessages = error.details.map((detail: any) => detail.message).join('\n');
			throw new Error(`Environment validation errors:\n${errorMessages}`);
		}

		this.envConfig = value;
	}

	public get(key: string): any {
		return this.envConfig[key];
	}
}

const EnvConfig = EnvironmentConfig.getInstance();


export const ENV = EnvConfig.get('NODE_ENV');
export const PORT = EnvConfig.get('PORT');
export const JWT_SECRET = EnvConfig.get('JWT_SECRET');
export const SSL = {
	IS_ACTIVE: EnvConfig.get('SSL_IS_ACTIVE'),
	KEY: EnvConfig.get('SSL_KEY_PATH'),
	CERT: EnvConfig.get('SSL_CERT_PATH'),
}
export const MONGODB_URL = EnvConfig.get('MONGODB_URI');
export const MONGODB_OPTIONS = {
	maxPoolSize: 20,
};

export { EnvConfig };
