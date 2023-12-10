import { AppLocation } from '@/web/Memu/AppMenu';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';

export interface AppConfig {
  cmdDefLocations: string[];
  home: AppLocation;
}

const appDir = path.join(os.homedir(), '.clickcommand');
const configFile = path.join(appDir, 'config.json');
const dbFile = path.join(appDir, 'sqlite3.db');
const clickCommandIndex = path.join(appDir, 'index');

function saveConfig() {
  writeFileSync(configFile, JSON.stringify(appConfig, null, 2));
}

function initConfig(): AppConfig {
  if (!existsSync(appDir)) {
    mkdirSync(appDir);
  }

  if (existsSync(configFile)) {
    const configStr = readFileSync(configFile, { encoding: 'utf8' });
    const configObj = JSON.parse(configStr);
    return configObj;
  }

  const appConfig = { cmdDefLocations: [], home: 'about' as const };
  writeFileSync(configFile, JSON.stringify(appConfig, null, 2));
  return appConfig;
}

const appConfig = initConfig();

export { appConfig, appDir, clickCommandIndex, dbFile, saveConfig };
