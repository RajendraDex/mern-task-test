import { Request, Response } from 'express';
import { ObjectSchema } from 'joi';

type ValidatableRequestParts = 'query' | 'body' | 'params';

class Validator {
	private static instance: Validator;

	private constructor() { }

	static get(): Validator {
		if (!Validator.instance) {
			Validator.instance = new Validator();
		}
		return Validator.instance;
	}

	check = (schema: Partial<Record<ValidatableRequestParts, ObjectSchema>>) =>
		(req: Request, res: Response, next: (e?: Error) => void): void => {
			const keys: ValidatableRequestParts[] = ['query', 'body', 'params'];

			for (const key of keys) {
				const partSchema = schema[key];
				if (partSchema) {
					const { error } = partSchema.validate(req[key], {
						abortEarly: true,
						allowUnknown: false
					});

					if (error) {
						return next(error);
					}
				}
			}

			next();
		};
}

const validator = Validator.get();

export { validator as Validator };
