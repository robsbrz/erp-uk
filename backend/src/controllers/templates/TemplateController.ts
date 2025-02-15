import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../base/BaseController';
import { templateService } from '../../services/templates/TemplateService';
import { BusinessTemplate } from '../../models/templates/BusinessTemplate';
import { AppError } from '../../utils/errors/AppError';
import { createLogger } from '../../utils/logger';

const logger = createLogger('TemplateController');

export class TemplateController extends BaseController<BusinessTemplate> {
    constructor() {
        super(templateService as any, 'Template');
    }

    async createTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('Creating new template', { templateData: req.body });

            const validationErrors = await this.validateCreate(req.body);
            if (validationErrors.length > 0) {
              throw new AppError('Validation failed', 400, true, { errors: validationErrors });
            }

            const template = await templateService.createTemplate(req.body);
            logger.info('Template created successfully', { templateId: template.id });
            
            res.status(201).json({
                message: 'Template created successfully',
                data: template
            });
        } catch (error) {
            logger.error('Error creating template', { error });
            next(error);
        }
    }

    async getTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('Fetching all templates');

            const { page = 1, limit = 10, search } = req.query;
            const filters = { search: search as string };

            const templates = await templateService.getTemplates();
            
            logger.info('Templates fetched successfully', { count: templates.length });
            
            res.json({
                message: 'Templates fetched successfully',
                data: templates,
                meta: {
                    total: templates.length,
                    page: Number(page),
                    limit: Number(limit)
                }
            });
        } catch (error) {
            logger.error('Error fetching templates', { error });
            next(error);
        }
    }

    async getTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            logger.info('Fetching template by id', { templateId: id });

            const template = await templateService.getTemplate(id);
            if (!template) {
                throw new AppError('Template not found', 404);
            }

            logger.info('Template fetched successfully', { templateId: id });
            res.json({
                message: 'Template fetched successfully',
                data: template
            });
        } catch (error) {
            logger.error('Error fetching template', { error, templateId: req.params.id });
            next(error);
        }
    }

    async addCustomField(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { templateId } = req.params;
            logger.info('Adding custom field to template', { 
                templateId, 
                fieldData: req.body 
            });

            const field = await templateService.addCustomField(templateId, req.body);
            
            logger.info('Custom field added successfully', { 
                templateId,
                fieldId: field.id 
            });

            res.status(201).json({
                message: 'Custom field added successfully',
                data: field
            });
        } catch (error) {
            logger.error('Error adding custom field', { 
                error, 
                templateId: req.params.templateId 
            });
            next(error);
        }
    }

    async configureTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const { templateId } = req.params;
            logger.info('Configuring tenant', { 
                userId: req.user.id,
                templateId,
                settings: req.body 
            });

            const config = await templateService.configureTenant(
                req.user.id,
                templateId,
                req.body
            );

            logger.info('Tenant configured successfully', {
                userId: req.user.id,
                templateId
            });

            res.status(201).json({
                message: 'Tenant configured successfully',
                data: config
            });
        } catch (error) {
            logger.error('Error configuring tenant', { 
                error,
                userId: req.user?.id,
                templateId: req.params.templateId 
            });
            next(error);
        }
    }

    async getTenantConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            logger.info('Fetching tenant configuration', { userId: req.user.id });

            const config = await templateService.getTenantConfig(req.user.id);
            if (!config) {
                throw new AppError('Tenant configuration not found', 404);
            }

            logger.info('Tenant configuration fetched successfully', { userId: req.user.id });
            
            res.json({
                message: 'Tenant configuration fetched successfully',
                data: config
            });
        } catch (error) {
            logger.error('Error fetching tenant configuration', { 
                error,
                userId: req.user?.id 
            });
            next(error);
        }
    }

    protected async validateCreate(data: Partial<BusinessTemplate>): Promise<string[]> {
        const errors: string[] = [];
        
        if (!data.name || !data.modules || !data.features) {
            errors.push('Missing required fields: name, modules, and features are required');
        }

        if (data.modules && (typeof data.modules !== 'object' || Object.keys(data.modules).length === 0)) {
            errors.push('Template must have at least one module');
        }

        // Validação adicional de features
        if (data.features && !Array.isArray(data.features)) {
            errors.push('Features must be an array');
        }

        // Validação de nome único
        if (data.name) {
            const existingTemplate = await templateService.getTemplateByName(data.name);
            if (existingTemplate) {
                errors.push('Template name must be unique');
            }
        }

        return errors;
    }
}

export const templateController = new TemplateController();
