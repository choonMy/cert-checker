import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';


const validationMiddleware = (
    type: any,
    value: string | 'body' | 'query' | 'params' = 'body',
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true,
): RequestHandler => {
    return (req, res, next) => {
        validate(plainToClass(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted })
            .then((errors: ValidationError[]) => {
                console.log(errors)
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
                    const childrenMessage = errors.map((error) => error.children.map((err: ValidationError) => Object.values(err.constraints || '')).join(', '));
                    next(new Error(message));
                } else {
                    next();
                }
            });
    };
};

export default validationMiddleware;
