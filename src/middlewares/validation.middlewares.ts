import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';

const validationMiddleware = (type: any, skipMissingProperties = false): RequestHandler => {
  return async (req: Request, _: Response, next: NextFunction) => {
    // validate receives the data to validate, return an array of errors(of type ValidationError), if there's any.
    // first argument the data to process and second and object of options, in this case we want to skip some
    // properties when we updated the data in the db.
    // plainToClass convert an object(data we send it) to an instance of a class.
    // first parameter the class, second the data we want to instanciate, in this case req.body.
    const errors: ValidationError[] = await validate(plainToClass(type, req.body), { skipMissingProperties });
    // check if there's any errors
    if (errors.length > 0) {
      // Object.values convert the object into an array, .constraints is a property of error that show the error 
      // by which our data is wrong.
      const message = errors.map((error: ValidationError) => Object.values(error.constraints!)).join(', ');
      // finally send the message to the exception of turn
      next(new HttpException(400, message));
    } else {
      next();
    }
  }
};

export default validationMiddleware;