import React, { useContext, useEffect, useState } from "react";
import { Layout, Input, Table, Button, Spin, Space, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useColumnTable } from "./columnTable";
import CreateOrEdit from "../CreateOrEdit";
import FilterData from "../FilterData";
import { SubjectContext } from "..";
import {
  GetListSubjectApiResponse,
  useLazyGetListSubjectQuery,
} from "../../../api/subject";

const { Content } = Layout;

const TableData = () => {
  const { parameter, setParameter } = useContext(SubjectContext);
  const [getList, { data, isFetching }] = useLazyGetListSubjectQuery();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<number>(0);

  useEffect(() => {
    getList({
      ...parameter,
    });
  }, [parameter]);

  const handleCreateNew = () => {
    setIsModalVisible(true);
    setEditId(0);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "F2") {
      event.preventDefault();
      handleCreateNew();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onPaginationChange = (page: number, pageSize: number) => {
    setParameter?.({ ...parameter, page: page, limit: pageSize });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any = useColumnTable({
    getList,
    setIsModalVisible,
    setEditId,
    currentPage: parseInt(String(parameter?.page)) || 1,
    pageSize: parseInt(String(parameter?.limit)) || 10,
  });

  const dataTable = data as GetListSubjectApiResponse;

  return (
    <>
      <FilterData />

      <Content style={{ padding: "16px", background: "#fff" }}>
        <Spin spinning={isFetching}>
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <Input.Search
              placeholder="Tìm kiếm theo tên"
              allowClear
              style={{ width: "375px" }}
              onSearch={(e) => {
                setParameter?.({ ...parameter, name: e });
              }}
            />
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ backgroundColor: "#0dac50" }}
                onClick={() => {
                  handleCreateNew();
                }}
              >
                Thêm mới (F2)
              </Button>
            </Space>
          </Space>
          <Table
            columns={columns}
            dataSource={dataTable?.data?.data}
            locale={{ emptyText: "Không có dữ liệu" }}
            bordered
            pagination={false}
            scroll={{ x: "max-content" }}
          />
          <div className="flex justify-end mt-3">
            <Pagination
              showSizeChanger
              onChange={onPaginationChange}
              defaultCurrent={1}
              total={dataTable?.data?.pagination?.totalItems}
              size="small"
              pageSize={Number(parameter?.limit || 10)}
            />
          </div>
        </Spin>
      </Content>

      {isModalVisible && (
        <CreateOrEdit
          editId={editId}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      )}
    </>
  );
};

export default TableData;
