import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  @Entity('setup_control')
  export class SetupControl {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column()
    templatesInitialized!: boolean;
  
    @Column({ type: 'timestamp' })
    setupDate!: Date;
  
    @Column({ nullable: true })
    setupCompletedBy!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  