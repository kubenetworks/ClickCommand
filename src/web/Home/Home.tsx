import Box from '@/components/Box';
import { getTime } from '@/lib/utils';
import { Button, Popover, Spin, Table, Tag } from '@arco-design/web-react';
import {
  IconCheckCircle,
  IconCloseCircle,
  IconInfo,
} from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import LogViewer from '../Runs/LogViewer';
import {
  useDeleteShortcut,
  useListRuns,
  useListShortcuts,
  useRunCommand,
} from '../request';

export default function Dashboard() {
  const {
    data: shortcuts,
    loading: loadingShortcuts,
    refetch: listShortcuts,
  } = useListShortcuts();
  const { refetch: deleteShortcut } = useDeleteShortcut();

  const { data: runs, loading: loadingRuns, refetch: listRuns } = useListRuns();
  const { refetch: runCommand } = useRunCommand();

  const refRefetch = useRef(listRuns);
  refRefetch.current = listRuns;
  useEffect(() => {
    const timer = setInterval(() => {
      refRefetch.current();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main
      className="dpfx"
      style={{ gap: 16, minHeight: 'calc(100vh - 100px)' }}
    >
      <Box className="pad" title="Shortcuts" icon="⚡️" style={{ flex: 1 }}>
        <Table
          size="small"
          border={false}
          scroll={{ y: 600 }}
          rowKey="id"
          data={shortcuts}
          pagination={false}
          columns={[
            {
              title: 'Command',
              dataIndex: 'clickCommandPath',
              render(col, { clickCommandPath, preset, cmdId }) {
                return (
                  <div
                    className="cursorPointer fs13 color1"
                    onClick={async () => {
                      await runCommand({
                        clickCommandPath,
                        env: JSON.parse(preset),
                        cmdId,
                      });

                      listRuns();
                    }}
                  >
                    <span className="mr8">{col}</span>
                    <Tag bordered color="purple" size="small">
                      {cmdId}
                    </Tag>
                  </div>
                );
              },
            },
            {
              title: 'Time',
              dataIndex: 'time',
              render(_, { createTime, preset, id }) {
                const strCreateTime = getTime(createTime);

                return (
                  <>
                    <span className="mr8 fs13 colorGrey">{strCreateTime}</span>

                    <Popover
                      content={
                        <>
                          <div>Preset</div>
                          <div className="fs13 colorGrey mb16">{preset}</div>
                          <div>
                            <Button
                              status="danger"
                              size="mini"
                              onClick={async () => {
                                await deleteShortcut({ id });
                                await listShortcuts();
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      }
                      trigger="click"
                    >
                      <Button
                        icon={<IconInfo />}
                        size="mini"
                        shape="round"
                      ></Button>
                    </Popover>
                  </>
                );
              },
            },
          ]}
        />
      </Box>

      <Box className="pad" title="Running" icon="🏃" style={{ flex: 1 }}>
        <Table
          border={false}
          size="small"
          pagination={false}
          scroll={{ y: 600 }}
          data={runs}
          rowKey="id"
          columns={[
            {
              title: 'Time',
              dataIndex: 'time',
              width: 190,
              render(
                _,
                { createTime, endTime, status, log, clickCommandContent },
              ) {
                const strCreateTime = getTime(createTime);
                const duration =
                  endTime &&
                  (dayjs(endTime).diff(createTime) / 1000).toFixed(2);

                const icon =
                  status === 'ok' ? (
                    <IconCheckCircle style={{ color: 'green' }} />
                  ) : status === 'failed' ? (
                    <IconCloseCircle style={{ color: 'red' }} />
                  ) : (
                    <Spin size={12} style={{ display: 'inline' }} />
                  );

                return (
                  <div className="fs13">
                    <div className="">{strCreateTime}</div>

                    <Tag
                      className="mr8"
                      size="small"
                      color={
                        status === 'ok'
                          ? 'green'
                          : status === 'pending'
                          ? 'orange'
                          : 'red'
                      }
                    >
                      <span className="mr8">{icon}</span>
                      Duration: {duration ? `${duration}s` : 'NA'}
                    </Tag>
                  </div>
                );
              },
            },
            {
              title: 'Command',
              render(
                _,
                {
                  status,
                  clickCommandPath,
                  clickCommandContent,
                  createTime,
                  log,
                  cmdId,
                },
              ) {
                return (
                  <>
                    <span className="colorGrey mr8">{clickCommandPath}</span>
                    <Tag bordered color="purple" size="small">
                      {cmdId}
                    </Tag>

                    <LogViewer
                      log={log}
                      modalProps={{
                        title: `${clickCommandContent.name} @${getTime(
                          createTime,
                        )}`,
                      }}
                      render={open => {
                        return (
                          <Button
                            size="mini"
                            type="text"
                            shape="round"
                            style={{ marginLeft: 'auto' }}
                            status={
                              status === 'ok'
                                ? 'success'
                                : status === 'failed'
                                ? 'danger'
                                : undefined
                            }
                            onClick={open}
                          >
                            {status === 'ok'
                              ? 'View Result'
                              : status === 'pending'
                              ? 'Check Log'
                              : 'Troubleshoot'}
                          </Button>
                        );
                      }}
                    />
                  </>
                );
              },
            },
          ]}
        />
      </Box>
    </main>
  );
}
