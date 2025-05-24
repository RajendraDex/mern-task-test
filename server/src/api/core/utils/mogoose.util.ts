import mongoose, { Types } from 'mongoose';
import { ApiError } from './apiError.util';
import httpStatus from 'http-status';

//* Convert a string to a valid Mongoose ObjectId or throw an error.
const toObjectId = (id: string): Types.ObjectId => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ObjectId: ${id}`);
	}
	return new mongoose.Types.ObjectId(id);
}

//* Convert an array of strings to valid Mongoose ObjectIds.
const toObjectIdArray = (ids: string[]): Types.ObjectId[] => {
	return ids.map(toObjectId);
}

export {
	toObjectId,
	toObjectIdArray
}
