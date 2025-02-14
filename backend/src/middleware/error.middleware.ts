import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err.message.includes('duplicate key')) {
    return res.status(400).json({
      message: 'Resource already exists'
    });
  }

  res.status(500).json({
    message: err.message || 'Something went wrong'
  });
};
