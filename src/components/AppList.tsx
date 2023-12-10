import classNames from "classnames";
import sunglasses from "public/img/svg/011-sunglasses.svg";
import compass from "public/img/svg/039-compass.svg";
import beach from "public/img/svg/045-beach.svg";
import hat from "public/img/svg/006-fedora-hat.svg";
import sailBoat from "public/img/svg/048-sail-boat.svg";
import React, { useMemo, CSSProperties } from "react";
import { NavLink } from "react-router-dom";

const appExecutor = [
  {
    id: "executor",
    name: "Executor",
    icon: hat,
    menu: [
      {
        name: "Host List",
        url: "host",
      },
      {
        name: "Action List",
        url: "action",
      },
      {
        name: "Execution List",
        url: "execution",
      },
    ],
  },
];

const appOthersArr = [
  {
    id: "k8s",
    name: "K8s Partner",
    icon: compass,
    menu: [
      {
        name: "Cluster List",
        url: "cluster",
      },
      {
        name: "Dashboard",
        url: "dashboard",
      },
    ],
  },
  {
    id: "helm",
    name: "Helm",
    icon: sailBoat,
    menu: [],
  },
  {
    id: "http-echo",
    name: "HTTP Echo",
    icon: sunglasses,
    menu: [],
  },
  {
    id: "chat",
    name: "Chat",
    icon: beach,
    menu: [],
  },
];

let appArr: typeof appExecutor = [];

if (WEBPACK_DEFINE_APPS === "executor") {
  appArr = appExecutor;
} else {
  appArr = appExecutor.concat(appOthersArr);
}

export { appArr };

export default function AppList({
  className,
  column = 4,
  style,
}: {
  column?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const widthPercentage = useMemo(() => {
    return (column * 100) / 24 + "%";
  }, [column]);

  return (
    <ul
      className={classNames("dpfx mono flexWrap", className)}
      style={{ ...style }}
    >
      {appArr.map((appObj) => (
        <li
          key={appObj.name}
          className="borderBox"
          style={{ width: widthPercentage, padding: 8 }}
        >
          <NavLink
            to={`/app/${appObj.id}`}
            className="cursorPointer dpbk"
            style={{
              border: "1px solid lightgrey",
              padding: "8px 10px",
              borderRadius: 20,
            }}
            activeStyle={{ border: "1px solid blue" }}
          >
            <img
              src={appObj.icon}
              className="dpbk mxAuto my8"
              width="45"
              alt={appObj.name}
            />
            <div className="textCenter">
              <span className="fs16">{appObj.name}</span>
            </div>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
