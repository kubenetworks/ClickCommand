import { app, dialog, ipcMain } from 'electron';
import { listCommands } from './apiCommand';
import { listRuns, runCommand } from './apiRun';
import { AppConfig, appConfig } from './config';

interface ResOk {
  status: 'ok';
  result: any;
  [key: string]: any;
}
interface ResFailed {
  status: 'failed';
  msg: string;
  [key: string]: any;
}
export type Res = ResOk | ResFailed;

export function registerApi() {
  ipcMain.handle('listCommands', listCommands);

  ipcMain.handle('listRuns', listRuns);
  ipcMain.handle('runCommand', runCommand);

  ipcMain.handle('getConfig', () => {
    {
      let result: AppConfig;

      if (app.isPackaged) {
        result = appConfig;
      } else {
        // 便于开发设置
        result = {
          ...appConfig,
          home: 'dashboard',
        };
      }

      return {
        status: 'ok',
        result,
      };
    }
  });
}

export async function selectPath() {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}
