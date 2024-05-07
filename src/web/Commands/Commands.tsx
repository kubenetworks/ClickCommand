import Box from '@/components/Box';
import { Alert, Button, Message, Tag } from '@arco-design/web-react';
import { IconCopy, IconFire } from '@arco-design/web-react/icon';
import { useLocationContext } from '../contexts/LocationContext';
import { useCreateShortcut, useListCommands, useRunCommand } from '../request';
import ModalRunCommand from './ModalRunCommand';
import { CommandSet } from '@/main/apiCommand';

export default function Commands() {
  const { data, loading } = useListCommands<CommandSet[]>();
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
      {data?.map(cmdSet => {
        const { name, description, path, cmdList } = cmdSet;

        return cmdList.map(cmd => {
          return (
            <Box className="pad" key={cmd.id}>
              <div className="fs16 fw500 dpfx" style={{ paddingBottom: 8 }}>
                <span className="mr8">{name}</span>
                <Tag bordered color="purple" size="small">
                  {cmd.id}
                </Tag>
              </div>
              <div>{description}</div>
              <div style={{ paddingBottom: 20 }}>{cmd.description}</div>

              <div style={{}}>
                <ModalRunCommand
                  cmdSet={cmdSet}
                  cmd={cmd}
                  onOk={async (val, flagShortcut) => {
                    await runCommand({
                      clickCommandPath: path,
                      cmdId: cmd.id,
                      env: val,
                    });

                    if (flagShortcut) {
                      await createShortcut({
                        clickCommandPath: path,
                        cmdId: cmd.id,
                        preset: val,
                      });
                      setLocation('dashboard');
                      return;
                    }

                    setLocation('run');
                  }}
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
        });
      })}
    </div>
  );
}
