import Box from '@/components/Box';
import { getTime } from '@/lib/utils';
import { Button, Popover, Spin, Tag } from '@arco-design/web-react';
import {
  IconCheckCircle,
  IconCloseCircle,
  IconInfo,
} from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { useListRuns } from '../request';
import LogViewer from './LogViewer';

export default function Runs() {
  const { data, refetch } = useListRuns();
  const refRefetch = useRef(refetch);
  refRefetch.current = refetch;

  useEffect(() => {
    const timer = setInterval(() => {
      refRefetch.current();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gap: '10px 10px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gridAutoFlow: 'dense',
      }}
    >
      {data?.map(item => {
        const {
          id,
          clickCommandContent,
          clickCommandPath,
          createTime,
          endTime,
          status,
          log,
          cmdId,
        } = item;

        const strCreateTime = getTime(createTime);
        const duration =
          endTime && (dayjs(endTime).diff(createTime) / 1000).toFixed(2);

        const icon =
          item.status === 'ok' ? (
            <IconCheckCircle style={{ color: 'green' }} />
          ) : item.status === 'failed' ? (
            <IconCloseCircle style={{ color: 'red' }} />
          ) : (
            <Spin />
          );

        return (
          <Box className="pad" key={id}>
            <div
              className="fs16 fw500 dpfx justifyBetween"
              style={{ paddingBottom: 8 }}
            >
              <span>
                {icon}
                <span className="ml4 mr8">{clickCommandContent.name}</span>
                <Tag bordered color="purple" size="small">
                  {cmdId}
                </Tag>
              </span>

              <Popover
                trigger="click"
                content={
                  <div className="breakall">Path: {clickCommandPath}</div>
                }
                position="top"
              >
                <Button
                  icon={<IconInfo />}
                  shape="round"
                  size="mini"
                  className="mr4"
                />
              </Popover>
            </div>

            <div style={{ paddingBottom: 20 }}>
              <Tag
                className="mr8"
                color={
                  status === 'ok'
                    ? 'green'
                    : status === 'pending'
                    ? 'orange'
                    : 'red'
                }
              >
                Duration: {duration ? `${duration}s` : 'NA'}
              </Tag>

              <span>{clickCommandContent.description}</span>
            </div>

            <div className="dpfx alignCenter">
              <span>{strCreateTime}</span>

              <LogViewer
                log={log}
                modalProps={{
                  title: `${clickCommandContent.name} @${getTime(createTime)}`,
                }}
                render={open => {
                  return (
                    <Button
                      size="mini"
                      type="primary"
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
            </div>
          </Box>
        );
      })}
    </div>
  );
}
