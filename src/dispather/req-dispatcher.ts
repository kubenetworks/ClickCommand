import { useEffect, useState } from "react";

interface Req {
  id: string;
  method: string;
  params: { [key: string]: any };
}

interface ResOk {
  id: string;
  status: "ok";
  [key: string]: any;
}

interface ResFailed {
  id: string;
  status: "failed";
  msg: string;
  [key: string]: any;
}

type Res = ResOk | ResFailed;

export interface ReqWithSingleRes {
  type: "single";
  status: "pending" | "end";
  req: Req;
  res?: Res;
}

export interface ReqWithMultipleRes {
  type: "multiple";
  status: "pending" | "end";
  req: Req;
  res?: Res[];
}

class ElectronRequest {
  port: MessagePort;
  requestMap: {
    [key: string]: ReqWithSingleRes | ReqWithMultipleRes;
  };

  constructor({ port }: { port: MessagePort }) {
    this.port = port;
    this.requestMap = {};

    port.onmessage = (event) => {
      console.info("Res: port-event", event);

      const data = event.data as Res;

      if (!data) {
        console.error("Res: data 为空");
        return;
      }

      if (!data.id) {
        console.error("Res: data.id 为空");
        return;
      }


      
    };
  }

  send({ method, params = {} }: { method: string; params?: object }) {
    const reqId = new Date().toISOString();
    const msg = { reqId, method, params };

    console.log("CommRequest: request", msg);
    this.port.postMessage(msg);
  }

  genPlot(params: object) {
    return this.send({
      method: "genPlot",
      params,
    });
  }
}

export function useElectronRequest() {
  const [ready, setReady] = useState(Boolean(window.electronRequest));

  useEffect(() => {
    if (ready || window.electronRequestLoading) return;

    window.electronRequestLoading = true;
    window.onmessage = (event) => {
      // event.source === window means the message is coming from the preload
      // script, as opposed to from an <iframe> or other source.
      if (event.source === window && event.data === "main-world-port") {
        const [port] = event.ports;
        // Once we have the port, we can communicate directly with the main
        // process.

        window.electronRequest = new ElectronRequest({ port });
        window.electronRequestLoading = false;
        setReady(true);

        // port.onmessage = (event) => {
        //   console.log('from main process:', event.data)
        //   port.postMessage(event.data * 2)
        // }
      }
    };
  }, [ready]);

  return {
    ready,
    electronRequest: window.electronRequest,
  };
}

declare global {
  interface Window {
    electronRequest: ElectronRequest;
    electronRequestLoading: boolean;
  }
}
