import { AppConfig } from '@/main/config';
import { ReactNode, createContext, useContext } from 'react';
import { useGetConfig } from '../request';

const ConfigContext = createContext({} as AppConfig);

export const useConfigContext = () => useContext(ConfigContext);
export function ConfigContextProvider({ children }: { children: ReactNode }) {
  const { data } = useGetConfig<AppConfig>();

  return (
    <ConfigContext.Provider value={data as AppConfig}>
      {data && children}
    </ConfigContext.Provider>
  );
}
