import { existsSync } from 'fs';
import { opendir, readFile } from 'fs/promises';
import path from 'path';
import { Res } from './api';
import { clickCommandIndex } from './config';

export interface Cmd {
  id: string;
  description: string;
  envs?: {
    id: string;
    title: string;
    default: boolean;
    help: string;
    uiType?: string;
  }[];
}

export interface ClickCommandJson {
  name: string;
  description: string;
  cmdList: Cmd[];
}

export interface CommandSet extends ClickCommandJson {
  path: string;
}

export async function listCommands(
  event: Electron.IpcMainInvokeEvent,
  ...args: any[]
): Promise<Res> {
  // const result = await context.db.all(
  //   `SELECT *
  //     FROM table_action
  //     ORDER BY createTime DESC`,
  // );
  const result = await readDefs(clickCommandIndex);

  return {
    status: 'ok',
    result,
  };
}

async function readDefs(defPath: string) {
  if (!existsSync(defPath)) return [];

  const dir = await opendir(defPath);

  const defs = [];
  for await (const dirent of dir) {
    if (dirent.name.startsWith('.')) continue;
    if (dirent.isFile()) continue;

    const clickcommandJson = path.join(
      defPath,
      dirent.name,
      'clickcommand.json',
    );
    const exists = existsSync(clickcommandJson);
    if (!exists) continue;

    const file = await readFile(clickcommandJson, {
      encoding: 'utf8',
    });
    const defObj: CommandSet = JSON.parse(file);

    defObj.path = clickcommandJson;
    defs.push(defObj);
  }

  return defs;
}
