import { ConnectionOptions } from 'typeorm';
import { User } from '../models/auth/User';
import { BusinessTemplate } from '../models/templates/BusinessTemplate';
import { CustomField } from '../models/templates/CustomField';

const config: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "robsbrz",
  password: "",
  database: "erp_uk",
  synchronize: true,
  logging: true,
  entities: [User, BusinessTemplate, CustomField],
  migrations: [],
  subscribers: []
};

export default config;