import { CustomAPIError } from "./CustomError";

export class InvalidParam extends CustomAPIError{
    constructor(message: string, code: number, endpoint?: string) {
        super(message, code, endpoint);
        this.name = 'InvalidParam';
        Error.captureStackTrace(this, this.constructor);
        this.printStackTrace();
    }
}

