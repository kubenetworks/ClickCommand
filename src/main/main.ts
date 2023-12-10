import Logger from '@/lib/logger';
import { context } from './context';
import initDb from './initDb';
import { registerApi } from './api';

export async function initApp() {
  const logger = new Logger();
  logger.module = 'init';
  logger.submodule = 'app';

  logger.log(`Nodejs Version: ${process.version}`);

  logger.log('db');
  context.db = await initDb();
  logger.ok('db');

  logger.log('registerApi');
  registerApi();
  logger.ok('registerApi');
}
