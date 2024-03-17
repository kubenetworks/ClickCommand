import Logger from '@/lib/logger';
import { getIsoTime } from '@/lib/utils';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { isEqual } from 'lodash-es';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Res } from './api';
import { context } from './context';
import { CommandObj } from './apiCommand';

export interface RunObj {
  id: string;
  createTime: string;
  spawnTime: string;
  endTime: string;
  status: string;
  log: LogItem[];
  clickCommandPath: string;
  clickCommandContent: Omit<CommandObj, 'path'>;
  env: { [key: string]: string };
  targetType: string;
  targetInfo: string;
}

export interface LogItem {
  source: 'stdout' | 'stderr';
  content: string;
  time: string;
}

type RunStatus = 'pending' | 'spawn' | 'ok' | 'failed';

const logObj: { [key: string]: LogItem[] } = {};

export async function listRuns(
  event: Electron.IpcMainInvokeEvent,
  ...args: any[]
): Promise<Res> {
  const logger = new Logger();
  logger.module = 'listRuns';
  logger.setSubmoduleId();

  logger.log('init');

  const result = await context.db.all(
    `SELECT *
      FROM table_run
      ORDER BY createTime DESC LIMIT 100`,
  );

  logger.ok('query db');

  return {
    status: 'ok',
    result: result.map(item => {
      let log: LogItem[];

      if (item.status !== 'ok' && item.status !== 'failed') {
        log = logObj[item.id];
      } else {
        log = JSON.parse(item.log);
      }

      return {
        ...item,

        clickCommandContent: JSON.parse(item.clickCommandContent),
        env: JSON.parse(item.env),
        log,
      };
    }),
  };
}

export interface RunCommandParam {
  clickCommandPath: string;
  env: { [key: string]: string };
}

export async function runCommand(
  event: Electron.IpcMainInvokeEvent,
  param?: RunCommandParam,
  ...args: any[]
): Promise<Res> {
  const logger = new Logger();
  logger.module = 'runCommand';
  logger.setSubmoduleId();

  logger.log('init');

  if (!param) {
    return {
      status: 'failed',
      msg: 'param is required',
    };
  }

  const { clickCommandPath, env } = param;
  let msg = '';
  if (!clickCommandPath.endsWith('clickcommand.json')) {
    msg = `clickCommandPath should end with "clickcommand.json"`;
  } else if (!clickCommandPath.startsWith('/')) {
    msg = `clickCommandPath should be an absolute path`;
  }

  logger.log(`clickCommandPath: ${clickCommandPath}`);

  if (msg) {
    return {
      status: 'failed',
      msg,
    };
  }

  const exists = existsSync(clickCommandPath);

  if (!exists) {
    return {
      status: 'failed',
      msg: `${clickCommandPath} not found`,
    };
  }

  logger.log(`readFile: ${clickCommandPath}`);
  const file = await readFile(clickCommandPath, {
    encoding: 'utf8',
  });
  const defObj = JSON.parse(file);
  const defEnvs = defObj.envs.map((item: any) => item.key);
  const paramEnvs = Object.keys(env);
  if (!isEqual(new Set(defEnvs), new Set(paramEnvs))) {
    return {
      status: 'failed',
      msg: `envs not equal. defEnvs: ${defEnvs.join()}; paramEnvs: ${paramEnvs.join()}`,
    };
  }

  const cwd = dirname(clickCommandPath);

  const envScoped: { [key: string]: string } = {};
  Object.keys(env).forEach(item => {
    envScoped[`CLICK_${item}`] = env[item];
  });

  // 创建 process
  let status = 'pending';
  const childProcess = spawn('python3', ['main.py'], {
    cwd,
    env: {
      ...envScoped,
      ...process.env,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // 创建 db 数据
  const id = uuidv4();
  await context.db.run(
    `INSERT INTO table_run (id, createTime, status, clickCommandPath, clickCommandContent, env, targetType)
    VALUES($id, $createTime, $status, $clickCommandPath, $clickCommandContent, $env, $targetType)`,
    {
      $id: id,
      $createTime: getIsoTime(),
      $status: status,
      $clickCommandPath: clickCommandPath,
      $clickCommandContent: file,
      $env: JSON.stringify(env),
      $targetType: 'local',
    },
  );

  // 接收 log
  logObj[id] = [];
  const currentLog = logObj[id];
  childProcess.stdout.on('data', (chunk: Buffer) => {
    logger.log('[event:data stdout]', `pre-status: ${status}`);

    currentLog.push({
      source: 'stdout',
      content: chunk.toString(),
      time: getIsoTime(),
    });
  });

  childProcess.stderr.on('data', (chunk: Buffer) => {
    logger.log('[event:data stderr]', `pre-status: ${status}`);

    currentLog.push({
      source: 'stderr',
      content: chunk.toString(),
      time: getIsoTime(),
    });
  });

  // 处理 spawn 实际未发现 emmit 该事件
  // childProcess.on('spawn', async () => {
  //   logger.log('[event:spawn]', `pre-status: ${status}`);

  //   status = 'spawn';

  //   context.db
  //     .run(
  //       `UPDATE table_run SET status = $status, spawnTime = $spawnTime
  //   WHERE runId = $runId`,
  //       { $status: status, $spawnTime: getIsoTime(), $runId: id },
  //     )
  //     .catch(err => logger.error('unknown', err?.message));
  // });

  childProcess.on('error', err => {
    logger.error('[event:error]', `pre-status: ${status}`, err.message);

    status = 'error';
  });

  childProcess.on('close', (code, signal) => {
    logger.log(
      '[event:close]',
      `pre-status: ${status}`,
      `code: ${code || '-'}`,
      `signal: ${signal || '-'}`,
    );

    if (code || signal) {
      status = 'failed';
    } else {
      status = 'ok';
    }

    context.db
      .run(
        `UPDATE table_run SET status = $status, endTime = $endTime, log = $log
  WHERE id = $id`,
        {
          $status: status,
          $endTime: getIsoTime(),
          $id: id,
          $log: JSON.stringify(currentLog),
        },
      )
      .catch(err => logger.error('db error:', err?.message))
      .finally(() => {
        delete logObj[id];
      });
  });

  return {
    status: 'ok',
    result: id,
  };
}
