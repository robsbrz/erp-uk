import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Entities
import { BusinessTemplate } from '../models/templates/BusinessTemplate';
import { CustomField } from '../models/templates/CustomField';
import { SetupControl } from '../models/templates/setupcontrol';
import { TenantConfig } from '../models/customization/TenantConfig';
import { User } from '../models/auth/User'; // Caminho corrigido

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT || '5432'),
  username: process.env.TYPEORM_USERNAME || 'robsbrz',
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE || 'erp_uk',
  entities: [
    BusinessTemplate,
    CustomField,
    SetupControl,
    TenantConfig,
    User
  ],
  migrations: [
    __dirname + '/../database/migrations/*.{js,ts}'
  ],
  synchronize: process.env.NODE_ENV === 'development',
  logging: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default AppDataSource;
