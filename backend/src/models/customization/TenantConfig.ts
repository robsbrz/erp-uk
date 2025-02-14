import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { BusinessTemplate } from '../templates/BusinessTemplate';
import { User } from '../auth/User';
@Entity('tenant_configs')
export class TenantConfig {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  owner!: User;

  @ManyToOne(() => BusinessTemplate, { eager: true })
  template!: BusinessTemplate;

  @Column('jsonb', { default: {} })
  customSettings!: Record<string, any>;

  @Column('jsonb', { default: {} })
  activeModules!: {
    [key: string]: {
      enabled: boolean;
      settings?: Record<string, any>;
    };
  };

  @Column('jsonb', { default: {} })
  customFieldValues!: {
    [entityType: string]: {
      [fieldId: string]: any;
    };
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
