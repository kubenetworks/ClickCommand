import { createRoot } from 'react-dom/client';
import { AppMenu } from './Memu/AppMenu';

import '@arco-design/web-react/dist/css/arco.css';
import en from '@arco-design/web-react/es/locale/en-US';

import { ConfigProvider } from '@arco-design/web-react';
import About from './About/About';
import Commands from './Commands/Commands';
import Dashboard from './Home/Home';
import Runs from './Runs/Runs';
import { ConfigContextProvider } from './contexts/ConfigContext';
import {
  LocationContextProvider,
  useLocationContext,
} from './contexts/LocationContext';
import './index.css';

function App() {
  const { location } = useLocationContext();

  function getLocationContent() {
    if (location === 'dashboard') {
      return <Dashboard />;
    } else if (location === 'cmd') {
      return <Commands />;
    } else if (location === 'run') {
      return <Runs />;
    } else if (location === 'about') {
      return <About />;
    }

    return <div>Unknown Location: {location}</div>;
  }
  const locationContent = getLocationContent();

  return (
    <>
      <AppMenu />
      {locationContent}
    </>
  );
}

function initApp() {
  const el = document.getElementById('root');
  if (!el) {
    console.error('Element with id=root not found!');
    return;
  }

  const root = createRoot(el);
  root.render(
    <ConfigContextProvider>
      <LocationContextProvider>
        <ConfigProvider locale={en}>
          <App />
        </ConfigProvider>
      </LocationContextProvider>
    </ConfigContextProvider>,
  );
}

initApp();
