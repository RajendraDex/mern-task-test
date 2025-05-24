import httpStatus from 'http-status';

class ApiError extends Error {
	public statusCode: number;
	public isOperational: boolean;
	public override stack?: string;

	constructor(statusCode: number, message: string, isOperational = true, stack?: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export { ApiError };