import { Typography } from "@arco-design/web-react";
import React, { CSSProperties, PropsWithChildren } from "react";

export default function Ellipsis({
  style,
  children,
}: PropsWithChildren<{ style?: CSSProperties }>) {
  return (
    <Typography.Text
      className="mb0"
      style={{
        font: "inherit",
        color: "inherit",
        whiteSpace: "initial",
        ...style,
      }}
      ellipsis={{
        showTooltip: {
          type: "popover",
        },
        rows: 2,
      }}
    >
      {children}
    </Typography.Text>
  );
}
