// src/database/DatabaseConfiguration.ts

import mongoose, { Connection, ConnectOptions } from 'mongoose';
import { Logger } from './logger.config';
import { MONGODB_URL, MONGODB_OPTIONS, ENV } from './environment.config';

class DatabaseConfiguration {
	private static instance: DatabaseConfiguration;
	private connection: Connection | null = null;
	private readonly uri: string = MONGODB_URL;
	private readonly options: ConnectOptions = MONGODB_OPTIONS;

	private constructor() { }


	// * Get singleton instance
	public static getInstance(): DatabaseConfiguration {
		if (!DatabaseConfiguration.instance) {
			DatabaseConfiguration.instance = new DatabaseConfiguration();
		}
		return DatabaseConfiguration.instance;
	}

	//* Establish connection if not already connected
	public async connect(): Promise<Connection> {
		if (!this.connection) {
			try {
				const db = await mongoose.connect(this.uri, this.options);
				this.connection = db.connection;
				this.setupEvents();
				Logger.info('MongoDB connection established.');
			} catch (err) {
				Logger.error('Error establishing MongoDB connection:', err);
				throw err;
			}
		}
		return this.connection;
	}


	//* Setup Mongoose event listeners
	private setupEvents(): void {
		mongoose.connection.on('connected', () => {
			const displayUri = ENV === 'development' ? this.uri : 'Mongo Atlas';
			Logger.info(`Mongoose connected to ${displayUri}`);
		});

		mongoose.connection.on('error', (err) => {
			Logger.error('Mongoose connection error:', err);
		});

		mongoose.connection.on('disconnected', () => {
			Logger.info('Mongoose disconnected');
		});
	}

	/**
	 * Close MongoDB connection
	 */
	public async close(): Promise<void> {
		try {
			if (this.connection) {
				await mongoose.connection.close();
				Logger.info('MongoDB connection closed.');
				this.connection = null;
			} else {
				Logger.info('MongoDB connection not found');
			}
		} catch (err) {
			Logger.error('Error closing MongoDB connection:', err);
		}
	}
}

const Mongoose = DatabaseConfiguration.getInstance();

export { Mongoose };
