import { Cmd, CommandSet } from '@/main/apiCommand';
import {
  Button,
  Form,
  FormInstance,
  Input,
  Modal,
  ModalProps,
  Switch,
  Tag,
} from '@arco-design/web-react';
import { IconThunderbolt } from '@arco-design/web-react/icon';
import { ReactNode, useRef, useState } from 'react';

export default function ModalRunCommand({
  render,
  modalProps = {},
  onOk,
  cmdSet,
  cmd,
}: {
  render(open: () => void): ReactNode;
  modalProps?: ModalProps;
  onOk(value: { [key: string]: string }, flagShortcut?: boolean): Promise<void>;
  cmdSet: CommandSet;
  cmd: Cmd;
}) {
  const [visible, setVisible] = useState(false);

  function open() {
    setVisible(true);
  }

  function close() {
    setVisible(false);
  }

  const refForm = useRef<FormInstance>(null);

  return (
    <>
      {render(open)}

      <Modal
        title={
          <>
            <span className="mr8">Run {cmdSet.name}</span>
            <Tag bordered color="purple" size="small">
              {cmd.id}
            </Tag>
          </>
        }
        visible={visible}
        unmountOnExit
        onOk={async () => {
          const env = refForm.current?.getFieldsValue();
          console.log('env', env);

          if (!env) return;

          await onOk(env);

          close();
        }}
        onCancel={close}
        okText="Run"
        style={{ width: 660 }}
        maskClosable={false}
        closable={false}
        autoFocus={false}
        footer={(cancel, ok) => {
          return (
            <>
              {cancel}
              {ok}
              <Button
                type="primary"
                icon={<IconThunderbolt />}
                onClick={async () => {
                  const env = refForm.current?.getFieldsValue();
                  console.log('env', env);

                  if (!env) return;

                  await onOk(env, true);

                  close();
                }}
              >
                Create Shortcut & Run
              </Button>
            </>
          );
        }}
        {...modalProps}
      >
        <Form ref={refForm} style={{ minHeight: 220 }}>
          {cmd.envs?.map(env => {
            return (
              <Form.Item
                key={env.id}
                field={env.id}
                label={env.title}
                help={env.help}
                initialValue={env.default}
                triggerPropName={
                  env.uiType?.startsWith('switch') ? 'checked' : undefined
                }
              >
                {env.uiType === 'switch' ? <Switch /> : <Input />}
              </Form.Item>
            );
          })}
        </Form>
      </Modal>
    </>
  );
}
