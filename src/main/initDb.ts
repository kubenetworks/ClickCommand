import Logger from '@/lib/logger';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { dbFile } from './config';

export default async function initDb() {
  const logger = new Logger();
  logger.module = 'init';
  logger.submodule = 'db';

  logger.log(`opening dbFile: ${dbFile}`);
  // initialize database
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database,
  });
  logger.ok('open sqlite');

  await db.run(`CREATE TABLE IF NOT EXISTS table_host (
    id TEXT NOT NULL UNIQUE,
    user TEXT NOT NULL,
    hostname TEXT NOT NULL,
    port TEXT NOT NULL,
    desc TEXT,
    createTime TEXT NOT NULL,
    updateTime TEXT NOT NULL,
    publicKey TEXT NOT NULL,
    secretKey TEXT NOT NULL
  )`);
  logger.ok('create table_host');

  await db.run(`CREATE TABLE IF NOT EXISTS table_action (
    actionId TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    startup TEXT NOT NULL,
    file1Name TEXT,
    file1Content TEXT,
    file2Name TEXT,
    file2Content TEXT,
    file3Name TEXT,
    file3Content TEXT,
    env TEXT,
    createTime TEXT NOT NULL,
    updateTime TEXT NOT NULL
  )`);
  logger.ok('create table_action');

  await db.run(`CREATE TABLE IF NOT EXISTS table_execution (
    executionId TEXT NOT NULL UNIQUE,
    descExecution TEXT,
    createTime TEXT NOT NULL,
    endTime TEXT,
    status TEXT,
    reason TEXT,
    result TEXT,
    user TEXT NOT NULL,
    hostname TEXT NOT NULL,
    port TEXT NOT NULL,
    descHost TEXT,
    publicKey TEXT NOT NULL, 
    secretKey TEXT NOT NULL,
    actionName,
    startup,
    file1Name,
    file1Content,
    file2Name,
    file2Content,
    file3Name,
    file3Content,
    env TEXT
    )`);
  logger.ok('create table_execution');

  await db.run(`CREATE TABLE IF NOT EXISTS table_run (
    id TEXT NOT NULL UNIQUE,
    createTime TEXT NOT NULL,
    spawnTime TEXT,
    endTime TEXT,
    status TEXT,
    log TEXT,
    clickCommandPath TEXT,
    clickCommandContent TEXT,
    env TEXT,
    targetType TEXT,
    targetInfo TEXT
  )`);
  logger.ok('create table_execution');

  return db;
}
