import { Spin } from "@arco-design/web-react";
import React, { CSSProperties, useEffect, useRef, useState } from "react";

export default function Loading({ style }: { style?: CSSProperties }) {
  const [visible, setVisible] = useState(false);
  const refNum = useRef(0);

  useEffect(() => {
    refNum.current = setTimeout(() => {
      refNum.current = 0;
      setVisible(true);
    }, 500);

    return () => {
      clearTimeout(refNum.current);
    };
  }, []);

  if (!visible) return <></>;

  return (
    <Spin
      style={{
        display: "block",
        textAlign: "center",
        padding: "120px 0",
        ...style,
      }}
    />
  );
}
