import { Divider, Dropdown, Menu } from '@arco-design/web-react';
import {
  IconBulb,
  IconCommand,
  IconFire,
  IconTool,
} from '@arco-design/web-react/icon';
import Box from '../../components/Box';
import { useLocationContext } from '../contexts/LocationContext';

export const AppLocations = [
  {
    id: 'dashboard',
    icon: IconCommand,
    name: 'Workbench',
  },
  {
    id: 'cmd',
    icon: IconTool,
    name: 'Commands',
  },
  {
    id: 'run',
    icon: IconFire,
    name: 'Runs',
  },
  {
    id: 'about',
    icon: IconBulb,
    name: 'About',
  },
] as const;
export type AppLocation = (typeof AppLocations)[number]['id'];

export function AppMenu() {
  const { location, setLocation } = useLocationContext();

  const locationObj = AppLocations.find(item => item.id === location);
  const Icon = locationObj?.icon;

  return (
    <Box
      className="dpfx alignCenter "
      style={{ fontFamily: 'fantasy', marginBottom: 12 }}
    >
      <div className="dpfx alignCenter" style={{ width: 260 }}>
        <Dropdown
          trigger="click"
          droplist={
            <Menu style={{ minWidth: 330 }}>
              {AppLocations.map(({ id, icon, name }) => {
                const Icon = icon;
                return (
                  <Menu.Item
                    key={id}
                    onClick={() => {
                      setLocation(id);
                    }}
                  >
                    <Icon className="mr4" />
                    {name}
                  </Menu.Item>
                );
              })}
            </Menu>
          }
          position="bl"
        >
          <div className="pad cursorPointer">
            <span>ClickCommand</span>
            <Divider type="vertical" />
            <span className="mr4">{locationObj?.name}</span>
            {Icon && <Icon />}
          </div>
        </Dropdown>
      </div>

      {/* {location === 'cmd' && (
        <div style={{}}>
          <ModalCreateCommand
            modalProps={{}}
            editorProps={{}}
            render={open => {
              return (
                <Button icon={<IconPlus />} type="text" onClick={open}>
                  Create Command
                </Button>
              );
            }}
          />
        </div>
      )} */}
    </Box>
  );
}
