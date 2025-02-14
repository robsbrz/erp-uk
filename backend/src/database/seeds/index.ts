import { createConnection } from 'typeorm';
import config from '../../config/database';
import { seedBusinessTemplates } from './BusinessTemplateSeeds';

const runSeeds = async () => {
  try {
    const connection = await createConnection(config);
    await seedBusinessTemplates();
    await connection.close();
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

runSeeds();