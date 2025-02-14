import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { CustomField } from './CustomField';

export type ModuleType = 'appointments' | 'inventory' | 'pos' | 'medical_records' | 
                        'services' | 'manufacturing' | 'compliance' | 'billing' | 
                        'clinical' | 'investments' | 'care' | 'maintenance' | 
                        'financial' | 'legal' | 'academic';

@Entity('business_templates')
export class BusinessTemplate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('simple-array')
  features!: string[];

  @Column('jsonb')
  modules!: {
    [key in ModuleType]?: {
      enabled: boolean;
      settings?: Record<string, any>;
    };
  };

  @OneToMany(() => CustomField, field => field.template, {
    cascade: true,
    eager: true
  })
  customFields!: CustomField[];

  @Column('jsonb')
  defaultSettings!: {
    currency: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
    [key: string]: any;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
