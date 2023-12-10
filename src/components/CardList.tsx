import {
  Card,
  Descriptions,
  Grid,
  Input,
  Link as ArcoLink,
  Pagination,
  Tag,
} from "@arco-design/web-react";
import React, { useMemo, useState } from "react";
import { getTime } from "src/lib/utils";
import Ellipsis from "./Ellipsis";
import ModalEditor from "./ModalEditor";

const { Row, Col } = Grid;

export default function CardList({
  resourceListObj,
}: {
  resourceListObj: any;
}) {
  const [pageNumberAndSize, setPageNumberAndSize] = useState([1, 9]);
  const [search, setSearch] = useState("");

  const filteredList = useMemo(() => {
    if (!search) return resourceListObj?.items;

    return resourceListObj?.items.reduce((acc: any[], item: any) => {
      if (item.metadata.name.includes(search)) {
        acc.push(item);
      }

      return acc;
    }, []);
  }, [search, resourceListObj]);

  const currentSlice = useMemo(() => {
    const start = (pageNumberAndSize[0] - 1) * pageNumberAndSize[1];
    const end = start + pageNumberAndSize[1];

    return filteredList?.slice(start, end);
  }, [pageNumberAndSize, filteredList]);

  return (
    <>
      {resourceListObj && (
        <div className="dpfx mb8">
          <Input.Search
            className="mr8 w320"
            allowClear
            placeholder="Please input to search resource name"
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPageNumberAndSize([1, pageNumberAndSize[1]]);
            }}
          />

          <Pagination
            total={filteredList?.length}
            current={pageNumberAndSize[0]}
            pageSize={pageNumberAndSize[1]}
            sizeOptions={[9, 18, 27]}
            sizeCanChange
            showTotal
            onChange={(pageNumber, pageSize) => {
              setPageNumberAndSize([pageNumber, pageSize]);
            }}
          />
        </div>
      )}

      {Boolean(currentSlice?.length) && (
        <Row gutter={[12, 12]} align="stretch">
          {currentSlice.map((item: any) => {
            const { name, creationTimestamp, annotations, labels } =
              item.metadata;

            const phase = item.status?.phase;

            return (
              <Col key={name} span={8}>
                <Card
                  headerStyle={{ border: "none" }}
                  size="small"
                  title={
                    <ModalEditor
                      modalProps={{
                        simple: true,
                        hideCancel: true,
                        okText: undefined,
                        title: name,
                      }}
                      editorProps={{
                        value: JSON.stringify(item, null, 2),
                        language: "json",
                        options: { readOnly: true },
                      }}
                      render={(open) => {
                        return (
                          <ArcoLink className="dpbk pl0" onClick={open}>
                            {name}
                          </ArcoLink>
                        );
                      }}
                    ></ModalEditor>
                  }
                  className="w100p h100p borderBox"
                >
                  {phase && (
                    <div className="mb8">
                      <Tag
                        color={
                          phase === "Running"
                            ? "green"
                            : phase === "Succeeded"
                            ? "arcoblue"
                            : "red"
                        }
                      >
                        {phase}
                      </Tag>
                    </div>
                  )}

                  <Descriptions
                    title={<div className="fs12">Labels</div>}
                    column={1}
                    size="mini"
                    data={Object.keys(labels || {}).map((item) => ({
                      label: <Ellipsis style={{ width: 180 }}>{item}</Ellipsis>,
                      value: <Ellipsis>{labels[item]}</Ellipsis>,
                    }))}
                  />

                  <Descriptions
                    title={<div className="fs12 mt8">Annotations</div>}
                    column={1}
                    size="mini"
                    data={Object.keys(annotations || {}).map((item) => ({
                      label: <Ellipsis style={{ width: 180 }}>{item}</Ellipsis>,
                      value: <Ellipsis>{annotations[item]}</Ellipsis>,
                    }))}
                  />

                  <footer className="fs12 mt8">
                    {getTime(creationTimestamp)}
                  </footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </>
  );
}
