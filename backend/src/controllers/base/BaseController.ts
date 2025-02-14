import { Request, Response, NextFunction } from 'express';
import { BaseService } from '../../services/base/BaseService';

export abstract class BaseController<T extends { id: string }> {
    protected service: BaseService<T>;
    protected entityName: string;

    constructor(service: BaseService<T>, entityName: string) {
        this.service = service;
        this.entityName = entityName;
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Parse query parameters
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);
            const search = req.query.search as string;
            
            // Get all items
            const items = await this.service.findAll({
                tenant: req.user?.tenantId,
                filters: req.query
            });

            // Apply search filter if provided
            const filteredItems = search 
                ? items.filter(item => 
                    Object.values(item).some(value => 
                        String(value).toLowerCase().includes(search.toLowerCase())
                    )
                )
                : items;

            // Apply pagination
            const startIndex = (page - 1) * limit;
            const paginatedItems = filteredItems.slice(startIndex, startIndex + limit);

            res.json({
                data: paginatedItems,
                total: filteredItems.length,
                page,
                totalPages: Math.ceil(filteredItems.length / limit)
            });
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const item = await this.service.findById(req.params.id, req.user?.tenantId);
            if (!item) {
                res.status(404).json({
                    message: `${this.entityName} not found`,
                    id: req.params.id
                });
                return;
            }
            res.json(item);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validationErrors = await this.validateCreate(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    message: 'Validation failed',
                    errors: validationErrors
                });
                return;
            }

            const item = await this.service.create(req.body, req.user?.tenantId);
            res.status(201).json(item);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validationErrors = await this.validateUpdate(req.body);
            if (validationErrors.length > 0) {
                res.status(400).json({
                    message: 'Validation failed',
                    errors: validationErrors
                });
                return;
            }

            const item = await this.service.update(req.params.id, req.body, req.user?.tenantId);
            if (!item) {
                res.status(404).json({
                    message: `${this.entityName} not found`,
                    id: req.params.id
                });
                return;
            }
            res.json(item);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deleted = await this.service.delete(req.params.id, req.user?.tenantId);
            if (!deleted) {
                res.status(404).json({
                    message: `${this.entityName} not found`,
                    id: req.params.id
                });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    protected async validateCreate(data: any): Promise<string[]> {
        return [];
    }

    protected async validateUpdate(data: any): Promise<string[]> {
        return [];
    }
}
