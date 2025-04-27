import React, { useContext, useEffect, useState } from "react";
import { Layout, Input, Table, Button, Spin, Space, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useColumnTable } from "./columnTable";
import CreateOrEdit from "../CreateOrEdit";
import FilterData from "../FilterData";
import { UniversityContext } from "..";
import {
  GetListUniversityApiResponse,
  useLazyGetListUniversityQuery,
} from "../../../api/university";

const { Content } = Layout;

const TableData = () => {
  const { parameter, setParameter } = useContext(UniversityContext);
  const [getList, { data, isFetching }] = useLazyGetListUniversityQuery();

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

  const dataTable = data as GetListUniversityApiResponse;

  return (
    <>
      <FilterData />

      <Content
        style={{
          padding: "24px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          margin: "24px",
          minHeight: "calc(100vh - 48px)",
        }}
      >
        <Spin spinning={isFetching}>
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "24px",
              padding: "16px",
              background: "#fafafa",
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Input.Search
              placeholder="Tìm kiếm theo tên"
              allowClear
              style={{
                width: "375px",
                borderRadius: "6px",
              }}
              onSearch={(e) => {
                setParameter?.({ ...parameter, name: e });
              }}
            />
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "#0dac50",
                  boxShadow: "0 2px 0 rgba(0,0,0,0.02)",
                  height: "40px",
                  padding: "0 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "6px",
                }}
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
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #f0f0f0",
            }}
          />
          <div className="flex justify-end mt-4">
            <Pagination
              showSizeChanger
              onChange={onPaginationChange}
              defaultCurrent={1}
              total={dataTable?.data?.pagination?.totalItems}
              size="small"
              pageSize={Number(parameter?.limit || 10)}
              style={{
                padding: "16px",
                background: "#fafafa",
                borderRadius: "8px",
                marginTop: "16px",
                border: "1px solid #f0f0f0",
              }}
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
