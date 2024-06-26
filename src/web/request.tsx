import { Res } from '@/main/api';
import { useEffect, useRef, useState } from 'react';

import { Notification } from '@arco-design/web-react';
import { isEqual } from 'lodash-es';
import type { RunCommandParam, RunObj } from '@/main/apiRun';
import {
  CreateShortcutParam,
  DeleteShortcutParam,
  ShortcutItem,
} from '@/main/apiShortcut';

export function useListShortcuts(param?: any) {
  return useRequest<ShortcutItem[]>({
    apiFunc: window.electronAPI.listShortcuts,
    apiFuncName: 'listShortcuts',
    param,
  });
}
export function useCreateShortcut<T = any>(param?: CreateShortcutParam) {
  return useRequest<T, CreateShortcutParam>({
    apiFunc: window.electronAPI.createShortcut,
    apiFuncName: 'createShortcut',
    param,
    manual: true,
  });
}
export function useDeleteShortcut<T = any>(param?: any) {
  return useRequest<T, DeleteShortcutParam>({
    apiFunc: window.electronAPI.deleteShortcut,
    apiFuncName: 'deleteShortcut',
    param,
    manual: true,
  });
}

export function useListCommands<T = any>(param?: any) {
  return useRequest<T>({
    apiFunc: window.electronAPI.listCommands,
    apiFuncName: 'listCommands',
    param,
  });
}

export function useGetConfig<T = any>(param?: any) {
  return useRequest<T>({
    apiFunc: window.electronAPI.getConfig,
    apiFuncName: 'getConfig',
    param,
  });
}

export function useListRuns(param?: any) {
  return useRequest<RunObj[]>({
    apiFunc: window.electronAPI.listRuns,
    apiFuncName: 'listRuns',
    param,
  });
}

export function useRunCommand(param?: RunCommandParam) {
  return useRequest<any, RunCommandParam>({
    apiFunc: window.electronAPI.runCommand,
    apiFuncName: 'runCommand',
    param,
    manual: true,
  });
}

function useRequest<TDATA = any, TPARAM = any>({
  apiFunc,
  apiFuncName,
  param,
  manual,
}: {
  apiFunc: (param?: TPARAM) => Promise<Res>;
  apiFuncName: string;
  param?: TPARAM;
  manual?: boolean;
}) {
  const refParam = useRef<any>('INIT');
  const [{ loading, data }, setReqState] = useState<{
    loading: boolean;
    data?: TDATA;
  }>({
    loading: manual ? false : true,
  });

  function refetch(paramRefetch?: TPARAM) {
    const computedParam = paramRefetch || param;

    console.info(`⬆️ ${apiFuncName}`, computedParam);

    setReqState({ loading: true, data });
    return apiFunc(computedParam).then(
      result => {
        console.info(`⬇️ ${apiFuncName}`, result);

        if (result.status === 'failed') {
          Notification.error({
            title: `[ERROR_FAILED] ${apiFuncName}`,
            content: result.msg,
          });
          setReqState({
            loading: false,
          });

          return result;
        }

        if (result.status === 'ok') {
          setReqState({
            loading: false,
            data: result.result,
          });

          return result;
        }

        Notification.error({
          title: `[ERROR_UNKNOWN] ${apiFuncName}`,
          content: JSON.stringify(result),
        });
        setReqState({
          loading: false,
        });
      },
      err => {
        console.error(`⬇️ [ERROR]${apiFuncName}`, err);

        Notification.error({
          title: `[ERROR_RPC] ${apiFuncName}`,
          content: err.message,
        });
        setReqState({
          loading: false,
        });
      },
    );
  }

  useEffect(() => {
    if (manual) return;

    if (isEqual(refParam.current, param)) return;

    refParam.current = param;

    refetch();
  }, [param]);

  return {
    loading,
    refetch,
    data,
  };
}
