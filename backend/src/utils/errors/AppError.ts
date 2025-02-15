export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly metadata?: any;

    constructor(
        message: string, 
        statusCode = 400, 
        isOperational = true,
        metadata?: any
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.metadata = metadata;

        Error.captureStackTrace(this, this.constructor);
    }
}