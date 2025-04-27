/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, Popconfirm } from "antd";
import { UserStatusType } from "@/type/global";
import { useMessage } from "@/context/MessageContext";
import { TypeSubject, useDeleteSubjectMutation } from "@/api/subject";
import { getStatusTag } from "@/utils/utils";

interface PropsType {
  getList: any;
  setEditId: React.Dispatch<React.SetStateAction<number>>;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage?: number;
  pageSize?: number;
}

export const useColumnTable = ({
  getList,
  setEditId,
  setIsModalVisible,
  currentPage = 1,
  pageSize = 10,
}: PropsType) => {
  const messageApi = useMessage();
  const [deleteRecord] = useDeleteSubjectMutation();

  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      fixed: "left",
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      ellipsis: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (status: UserStatusType) => {
        return <div>{getStatusTag(status)}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      fixed: "right" as const,
      align: "center" as const,
      render: (record: TypeSubject) => {
        return (
          <div className="flex gap-x-2 justify-center">
            <Button
              type="primary"
              onClick={() => {
                setIsModalVisible(true);
                setEditId(record?.id || 0);
              }}
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                boxShadow: "0 2px 0 rgba(0,0,0,0.02)",
                height: "32px",
                padding: "0 12px",
                fontSize: "14px",
              }}
            >
              Sửa
            </Button>

            <Popconfirm
              title="Xác nhận xoá"
              description="Bạn có chắc chắn muốn xoá bản ghi này không?"
              okText="Xoá"
              cancelText="Huỷ"
              onConfirm={() => {
                deleteRecord({ id: record?.id || 0 }).then((res: any) => {
                  if (res?.data?.success) {
                    messageApi.success("Xoá bản ghi thành công");
                    getList();
                  } else {
                    messageApi.error(" Xoá bản ghi không thành công");
                  }
                });
              }}
            >
              <Button
                danger
                style={{
                  height: "32px",
                  padding: "0 12px",
                  fontSize: "14px",
                }}
              >
                Xoá
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
