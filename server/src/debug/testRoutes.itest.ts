import { Request, Response, NextFunction } from 'express';
import { InvalidParam } from '../error/customErrorClasses/InvalidParams';

// integration testing 

// example for using custom global handling in express.js
 const SyncError = (req: Request, res: Response, next: NextFunction) => {
     throw new Error("Or some other custom error here!");
}

 const AsyncError = async (req: Request, res: Response, next: NextFunction) => {
    setTimeout(() => {
        Promise.resolve()
        .then(() => {
            throw new Error("Async error thrown.")
        }).catch(next);
    }, 100)
}

export const throwInvalidParamError = async (req: Request, res: Response,  next: NextFunction) => {
    next(new InvalidParam("Invalid Parameter sent", 400, req.path));
}