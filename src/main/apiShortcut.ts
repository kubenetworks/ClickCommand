import Logger from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';
import { Res } from './api';
import { context } from './context';

export interface ShortcutItem {
  id: string;
  createTime: string;
  updateTime: string;

  clickCommandPath: string;
  cmdId: string;
  preset: string;
}

export interface CreateShortcutParam {
  clickCommandPath: string;
  cmdId: string;
  preset: Record<string, any>;
}

export interface DeleteShortcutParam {
  id: string;
}

export async function listShortcuts(
  event: Electron.IpcMainInvokeEvent,
  ...args: any[]
): Promise<Res> {
  const logger = new Logger();
  logger.module = 'listShortcuts';
  logger.setSubmoduleId();

  logger.log('init');

  const result = await context.db.all(
    `SELECT * FROM table_shortcut 
    ORDER BY createTime DESC LIMIT 100`,
  );

  logger.ok('query db');

  return {
    status: 'ok',
    result,
  };
}

export async function createShortcut(
  event: Electron.IpcMainInvokeEvent,
  param: CreateShortcutParam,
): Promise<Res> {
  if (!param) {
    return {
      status: 'failed',
      msg: 'param is required',
    };
  }

  const { clickCommandPath, preset, cmdId } = param;
  const time = new Date().toISOString();
  const id = uuidv4();

  await context.db.run(
    `INSERT INTO table_shortcut (id, createTime, updateTime, clickCommandPath, cmdId, preset) 
    VALUES ($id, $createTime, $updateTime, $clickCommandPath, $cmdId, $preset )`,
    {
      $id: id,
      $createTime: time,
      $updateTime: time,
      $clickCommandPath: clickCommandPath,
      $cmdId: cmdId,
      $preset: JSON.stringify(preset),
    },
  );

  return { status: 'ok', result: id };
}

export async function deleteShortcut(
  event: Electron.IpcMainInvokeEvent,
  param: DeleteShortcutParam,
): Promise<Res> {
  if (!param) {
    return {
      status: 'failed',
      msg: 'param is required',
    };
  }

  const { id } = param;

  await context.db.run('DELETE FROM table_shortcut WHERE id = ?', id);

  return { status: 'ok', result: id };
}
