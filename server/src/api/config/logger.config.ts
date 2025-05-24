import winston, { format, transports } from 'winston';
import moment from 'moment';
import { ENV } from './environment.config';

const enumerateErrorFormat = format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const baseFormat = (env: string) => format.combine(
	enumerateErrorFormat(),
	env === 'development' ? format.colorize() : format.uncolorize(),
	format.splat(),
	format.printf(({ level, message }) => `${level}: ${message}`)
);

const fileFormat = (includeColor: boolean = false) => format.combine(
	format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
	format.errors({ stack: true }),
	format.align(),
	format.splat(),
	format.simple(),
	includeColor ? format.colorize() : format.uncolorize(),
	format.printf(({ level, message, timestamp, stack }) => {
		if (stack) {
			return `${level}: ${timestamp}: ${message} at => ${stack}`;
		}
		return `${level}: ${timestamp}: ${message}`;
	})
);

const logger = winston.createLogger({
	level: ENV === 'development' ? 'debug' : 'info',
	format: baseFormat(ENV),
	transports: [
		new transports.Console({ stderrLevels: ['error'] }),
		new transports.File({
			level: 'info',
			filename: `logs/log-${moment().format('MM-DD-YYYY')}.log`,
			format: fileFormat()
		}),
		new transports.File({
			level: 'error',
			filename: `logs/error-log-${moment().format('MM-DD-YYYY')}.log`,
			format: fileFormat()
		})
	]
});

export { logger as Logger };
