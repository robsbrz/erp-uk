import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { BusinessTemplate } from '../../models/templates/BusinessTemplate';
import { CustomField } from '../../models/templates/CustomField';
import { TenantConfig } from '../../models/customization/TenantConfig';

export class TemplateService {
  private templateRepository: Repository<BusinessTemplate>;
  private customFieldRepository: Repository<CustomField>;
  private tenantConfigRepository: Repository<TenantConfig>;

  constructor() {
    this.templateRepository = AppDataSource.getRepository(BusinessTemplate);
    this.customFieldRepository = AppDataSource.getRepository(CustomField);
    this.tenantConfigRepository = AppDataSource.getRepository(TenantConfig);
  }

  async createTemplate(data: Partial<BusinessTemplate>) {
    const template = this.templateRepository.create(data);
    await this.validateTemplate(template);
    return await this.templateRepository.save(template);
  }

  async getTemplates() {
    return await this.templateRepository.find({
      relations: ['customFields']
    });
  }

  async getTemplate(id: string) {
    return await this.templateRepository.findOne({
      where: { id },
      relations: ['customFields']
    });
  }

  async addCustomField(templateId: string, fieldData: Partial<CustomField>) {
    const template = await this.templateRepository.findOne({
      where: { id: templateId }
    });
    
    if (!template) throw new Error('Template not found');

    await this.validateCustomField(fieldData);

    const field = this.customFieldRepository.create({
      ...fieldData,
      template
    });

    return await this.customFieldRepository.save(field);
  }

  async configureTenant(userId: string, templateId: string, settings: any) {
    const template = await this.templateRepository.findOne({
      where: { id: templateId }
    });
    
    if (!template) throw new Error('Template not found');

    await this.validateTenantConfig(settings, template);

    const config = this.tenantConfigRepository.create({
      owner: { id: userId },
      template,
      customSettings: settings,
      activeModules: template.modules,
      customFieldValues: {}
    });

    return await this.tenantConfigRepository.save(config);
  }

  async updateTemplate(id: string, data: Partial<BusinessTemplate>) {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['customFields']
    });

    if (!template) throw new Error('Template not found');

    Object.assign(template, data);
    await this.validateTemplate(template);
    
    return await this.templateRepository.save(template);
  }

  async deleteTemplate(id: string) {
    const result = await this.templateRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  private async validateTemplate(template: Partial<BusinessTemplate>): Promise<void> {
    const errors: string[] = [];

    if (!template.name) {
      errors.push('Template name is required');
    }

    if (!template.modules || Object.keys(template.modules).length === 0) {
      errors.push('Template must have at least one module');
    }

    if (template.modules) {
      for (const [key, module] of Object.entries(template.modules)) {
        if (typeof module.enabled !== 'boolean') {
          errors.push(`Module ${key} must have an 'enabled' property`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`Template validation failed: ${errors.join(', ')}`);
    }
  }

  private async validateCustomField(field: Partial<CustomField>): Promise<void> {
    const errors: string[] = [];

    if (!field.name) {
      errors.push('Field name is required');
    }

    if (!field.type) {
      errors.push('Field type is required');
    }

    if (field.type === 'select' && (!field.options || field.options.length === 0)) {
      errors.push('Select field must have options');
    }

    if (errors.length > 0) {
      throw new Error(`Custom field validation failed: ${errors.join(', ')}`);
    }
  }

  private async validateTenantConfig(settings: any, template: BusinessTemplate): Promise<void> {
    const errors: string[] = [];

    // Validate required settings
    const requiredSettings = ['currency', 'dateFormat', 'timeFormat', 'timezone'];
    for (const setting of requiredSettings) {
      if (!settings[setting]) {
        errors.push(`Missing required setting: ${setting}`);
      }
    }

    // Validate module settings
    for (const [moduleName, moduleConfig] of Object.entries(template.modules)) {
      if (settings[moduleName] && typeof settings[moduleName] !== 'object') {
        errors.push(`Invalid settings for module: ${moduleName}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Tenant configuration validation failed: ${errors.join(', ')}`);
    }
  }

  async getTenantConfig(userId: string) {
    return await this.tenantConfigRepository.findOne({
      where: { owner: { id: userId } },
      relations: ['template', 'template.customFields']
    });
  }

  async updateTenantConfig(userId: string, settings: any) {
    const config = await this.tenantConfigRepository.findOne({
      where: { owner: { id: userId } },
      relations: ['template']
    });

    if (!config) throw new Error('Tenant configuration not found');

    await this.validateTenantConfig(settings, config.template);

    config.customSettings = {
      ...config.customSettings,
      ...settings
    };

    return await this.tenantConfigRepository.save(config);
  }
}

export const templateService = new TemplateService();
