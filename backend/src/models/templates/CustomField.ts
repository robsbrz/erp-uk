import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { BusinessTemplate } from './BusinessTemplate';

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'file';
export type EntityType = 'customers' | 'products' | 'services' | 'appointments';

@Entity('custom_fields')
export class CustomField {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  label!: string;

  @Column({
    type: 'enum',
    enum: ['text', 'number', 'date', 'select', 'multiselect', 'file']
  })
  type!: FieldType;

  @Column({
    type: 'enum',
    enum: ['customers', 'products', 'services', 'appointments']
  })
  entityType!: EntityType;

  @Column({ type: 'boolean', default: false })
  required!: boolean;

  @Column('simple-array', { nullable: true })
  options?: string[];

  @Column({ type: 'varchar', nullable: true })
  validation?: string;

  @Column({ type: 'boolean', default: false })
  segmentSpecific!: boolean;

  @ManyToOne(() => BusinessTemplate, (template) => template.customFields, {
    onDelete: 'CASCADE'
  })
  template!: BusinessTemplate;

  @Column('jsonb', { nullable: true })
  settings?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
