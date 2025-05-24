import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApiError } from './apiError.util';
import { ENV } from '../../config/environment.config';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
	let error = err;

	if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
		const message = error.message || httpStatus[statusCode as keyof typeof httpStatus];
		error = new ApiError(statusCode, message, false, err.stack);
	}

	next(error);
};

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
	let { statusCode, message } = err;

	if (ENV === 'production' && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[statusCode as keyof typeof httpStatus] as string;
	}

	res.locals.errorMessage = err.message;

	res.status(statusCode).json({
		code: statusCode,
		message,
		...(ENV === 'development' && { stack: err.stack }),
	});
};

export { errorConverter, errorHandler };
