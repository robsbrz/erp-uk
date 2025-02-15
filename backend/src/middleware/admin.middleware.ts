import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Admin privileges required'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: 'Error checking admin privileges',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
