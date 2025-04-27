import React, { useContext, useEffect, useState } from "react";
import { Layout, Input, Table, Button, Spin, Space, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useColumnTable } from "./columnTable";
import { OrderContext } from "..";
import {
  GetListOrderApiResponse,
  useLazyGetListOrderQuery,
} from "../../../api/order";

const { Content } = Layout;

const TableData = () => {
  const { parameter, setParameter } = useContext(OrderContext);
  const [getList, { data, isFetching }] = useLazyGetListOrderQuery();

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

  const dataTable = data as GetListOrderApiResponse;

  return (
    <>
      <Content style={{ padding: "16px", background: "#fff" }}>
        <Spin spinning={isFetching}>
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
    </>
  );
};

export default TableData;
