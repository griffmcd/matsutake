import { createConnection } from 'typeorm';
import config from './config/config';
import logger from './shared/logger';

const connectDB = async () => {
  logger.info(`server connecting to database at ${process.env.DB_HOST}`);
  await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(config.dbPort),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [
      `${config.dirName}/entities/*${config.ext}`,
    ],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  });
};

export default connectDB;
