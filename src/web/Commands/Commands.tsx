import Box from '@/components/Box';
import { CommandObj } from '@/main/apiCommand';
import { Alert, Button, Message } from '@arco-design/web-react';
import { IconCopy, IconFire } from '@arco-design/web-react/icon';
import { useLocationContext } from '../contexts/LocationContext';
import { useCreateShortcut, useListCommands, useRunCommand } from '../request';
import ModalRunCommand from './ModalRunCommand';

export default function Commands() {
  const { data, loading } = useListCommands<CommandObj[]>();
  const { refetch: createShortcut } = useCreateShortcut();
  const { refetch: runCommand } = useRunCommand();
  const { setLocation } = useLocationContext();

  if (!loading && !data?.length) {
    const gitCode =
      'git clone https://github.com/KubeNetworks/ClickCommand-Index.git ~/.clickcommand/index';

    return (
      <Box className="pad">
        <Alert
          type="warning"
          title="Initialize with ClickCommand-Index, the offical command
          index!"
          content={
            <div className="nowrap mono">
              {gitCode}
              <Button
                type="text"
                shape="round"
                icon={<IconCopy />}
                onClick={async () => {
                  await navigator.clipboard.writeText(gitCode);
                  Message.success('Copied!');
                }}
              />
            </div>
          }
        />
      </Box>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '10px 10px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gridAutoFlow: 'dense',
      }}
    >
      {data?.map(cmd => {
        const { name, envs, description, path } = cmd;
        return (
          <Box className="pad" key={path}>
            <div className="fs16 fw500" style={{ paddingBottom: 8 }}>
              {name}
            </div>
            <div style={{ paddingBottom: 20 }}>{description}</div>

            <div style={{}}>
              <ModalRunCommand
                onOk={async (val, flagShortcut) => {
                  await runCommand({
                    clickCommandPath: path,
                    env: val,
                  });

                  if (flagShortcut) {
                    await createShortcut({
                      clickCommandPath: path,
                      preset: val,
                    });
                    setLocation('dashboard');
                    return;
                  }

                  setLocation('run');
                }}
                cmd={cmd}
                render={open => {
                  return (
                    <Button
                      type="primary"
                      long
                      icon={<IconFire />}
                      onClick={open}
                    >
                      Run
                    </Button>
                  );
                }}
              />
            </div>
          </Box>
        );
      })}
    </div>
  );
}
