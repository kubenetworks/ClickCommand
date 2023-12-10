import { ReactNode, createContext, useContext, useState } from 'react';
import { AppLocation } from '../Memu/AppMenu';
import { useConfigContext } from './ConfigContext';

export interface LocationContextValues {
  location: AppLocation;
  setLocation(location: AppLocation): void;
}

const LocationContext = createContext({} as LocationContextValues);

export const useLocationContext = () => useContext(LocationContext);
export function LocationContextProvider({ children }: { children: ReactNode }) {
  const { home } = useConfigContext();
  const [location, setLocation] = useState(home);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
