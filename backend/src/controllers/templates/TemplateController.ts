import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../base/BaseController';
import { templateService } from '../../services/templates/TemplateService';
import { BusinessTemplate } from '../../models/templates/BusinessTemplate';

export class TemplateController extends BaseController<BusinessTemplate> {
    constructor() {
        super(templateService as any, 'Template');
    }

    protected async validateCreate(data: Partial<BusinessTemplate>): Promise<string[]> {
        const errors: string[] = [];
        
        if (!data.name || !data.modules || !data.features) {
            errors.push('Missing required fields: name, modules, and features are required');
        }

        if (data.modules && (typeof data.modules !== 'object' || Object.keys(data.modules).length === 0)) {
            errors.push('Template must have at least one module');
        }

        return errors;
    }

    async configureTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: 'User not authenticated'
                });
                return;
            }

            const userId = req.user.id;
            if (!userId) {
                res.status(401).json({
                    message: 'Invalid user ID'
                });
                return;
            }

            const { templateId } = req.params;
            const settings = req.body;

            if (!settings || typeof settings !== 'object') {
                res.status(400).json({
                    message: 'Invalid settings format'
                });
                return;
            }

            const requiredSettings = ['currency', 'dateFormat', 'timeFormat', 'timezone'];
            const missingSettings = requiredSettings.filter(setting => !settings[setting]);
            
            if (missingSettings.length > 0) {
                res.status(400).json({
                    message: 'Missing required settings',
                    missingSettings
                });
                return;
            }

            const config = await templateService.configureTenant(userId, templateId, settings);

            res.status(201).json({
                message: 'Tenant configured successfully',
                config
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Template not found') {
                    res.status(404).json({
                        message: 'Template not found',
                        templateId: req.params.templateId
                    });
                    return;
                }
                res.status(400).json({
                    message: 'Error configuring tenant',
                    error: error.message
                });
                return;
            }
            next(error);
        }
    }

    async getTenantConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: 'User not authenticated'
                });
                return;
            }

            const userId = req.user.id;
            if (!userId) {
                res.status(401).json({
                    message: 'Invalid user ID'
                });
                return;
            }

            const config = await templateService.getTenantConfig(userId);

            if (!config) {
                res.status(404).json({
                    message: 'Tenant configuration not found'
                });
                return;
            }

            res.json(config);
        } catch (error) {
            next(error);
        }
    }
}

export const templateController = new TemplateController();
