import { LogItem } from '@/main/apiRun';
import { List, Modal, ModalProps } from '@arco-design/web-react';
import { ReactNode, useRef, useState } from 'react';

export default function LogViewer({
  log,
  render,
  modalProps,
}: {
  log: LogItem[];
  render(open: () => void): ReactNode;
  modalProps?: ModalProps;
}) {
  const [visible, setVisible] = useState(false);

  function open() {
    setVisible(true);
  }

  function close() {
    setVisible(false);
  }
  return (
    <>
      {render(open)}

      <Modal
        visible={visible}
        unmountOnExit
        onOk={() => {
          close();
        }}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        style={{ width: '70vw' }}
        hideCancel
        okText="Close"
        {...modalProps}
      >
        <section className="dpfx mb8">
          <div className="mlAuto dpfx">
            <div
              className="mr8"
              style={{
                backgroundColor: '#ff616130',
                width: 48,
                height: 22,
                borderRadius: 8,
              }}
            ></div>
            <span className="mr16">stderr</span>

            <div
              className="mr8"
              style={{
                backgroundColor: '#f6f6f6',
                width: 48,
                height: 22,
                borderRadius: 8,
              }}
            ></div>
            <span>stdout</span>
          </div>
        </section>

        <section className="mono" style={{ fontSize: 13 }}>
          {log.map((item, index) => {
            return (
              <div
                // item.time 可能重复
                key={index}
                style={{
                  marginBottom: 1,
                  padding: '0 8px',
                  borderRadius: 4,
                  whiteSpace: 'pre-wrap',
                  backgroundColor:
                    item.source === 'stderr' ? '#ff616130' : '#f6f6f6',
                }}
              >
                <div style={{ color: 'grey' }}>{item.time}</div>
                <div style={{ minWidth: 0, wordBreak: 'break-all' }}>
                  {item.content}
                </div>
              </div>
            );
          })}
        </section>
      </Modal>
    </>
  );
}
