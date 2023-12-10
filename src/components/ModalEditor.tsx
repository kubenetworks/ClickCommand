import { Modal, ModalProps } from "@arco-design/web-react";
import Editor, { EditorProps } from "@monaco-editor/react";
import React, { ReactNode, useRef, useState } from "react";

export default function ModalEditor({
  render,
  modalProps,
  editorProps,
  onOk,
}: {
  render(open: () => void): ReactNode;
  modalProps: ModalProps;
  editorProps: EditorProps;
  onOk?(close: () => void, value: string): void;
}) {
  const [visible, setVisible] = useState(false);
  const refVal = useRef("");

  function open() {
    setVisible(true);
  }

  function close() {
    setVisible(false);
  }

  const editorPropsComputed = {
    ...editorProps,
    options: {
      renderLineHighlight: "none",
      wordWrap: "on",
      ...editorProps.options,
    },
  } as const;

  return (
    <>
      {render(open)}

      <Modal
        visible={visible}
        unmountOnExit
        onOk={() => {
          if (onOk) {
            onOk(close, refVal.current);
            return;
          }

          close();
        }}
        onCancel={() => setVisible(false)}
        okText="Save"
        autoFocus={false}
        style={{ width: 1200 }}
        {...modalProps}
      >
        <Editor
          height="70vh"
          theme="vs-dark"
          language="shell"
          onChange={(val) => {
            refVal.current = val || "";
          }}
          {...editorPropsComputed}
        />
      </Modal>
    </>
  );
}
