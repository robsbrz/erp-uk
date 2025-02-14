import { Repository, DeepPartial, FindOptionsWhere, EntityTarget, ObjectLiteral } from 'typeorm';
import { AppDataSource } from '../../data-source';

export abstract class BaseService<T extends ObjectLiteral> {
    protected repository: Repository<T>;
    protected entityName: string;

    constructor(entity: new () => T, entityName: string) {
        this.repository = AppDataSource.getRepository<T>(entity);
        this.entityName = entityName;
    }

    async findAll(options: { tenant?: string; filters?: any; } = {}): Promise<T[]> {
        const where: FindOptionsWhere<T> = {};
        if (options.tenant) {
            Object.assign(where, { tenantId: options.tenant });
        }
        if (options.filters) {
            Object.assign(where, options.filters);
        }
        return this.repository.find({ where });
    }

    async findById(id: string, tenant?: string): Promise<T | null> {
        const where: FindOptionsWhere<T> = { id } as any;
        if (tenant) {
            Object.assign(where, { tenantId: tenant });
        }
        return this.repository.findOne({ where });
    }

    async create(data: DeepPartial<T>, tenant?: string): Promise<T> {
        if (tenant) {
            Object.assign(data, { tenantId: tenant });
        }
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async update(id: string, data: DeepPartial<T>, tenant?: string): Promise<T | null> {
        const where: FindOptionsWhere<T> = { id } as any;
        if (tenant) {
            Object.assign(where, { tenantId: tenant });
        }
        
        const entity = await this.repository.findOne({ where });
        if (!entity) return null;

        Object.assign(entity, data);
        return this.repository.save(entity);
    }

    async delete(id: string, tenant?: string): Promise<boolean> {
        const where: FindOptionsWhere<T> = { id } as any;
        if (tenant) {
            Object.assign(where, { tenantId: tenant });
        }
        
        const result = await this.repository.delete(where);
        return result.affected ? result.affected > 0 : false;
    }

    protected async validate(entity: DeepPartial<T>): Promise<string[]> {
        return [];
    }
}
