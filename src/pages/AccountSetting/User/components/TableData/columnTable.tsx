/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, Popconfirm } from "antd";
import { TypeUser, useDeleteUserMutation } from "@/api/user";
import { useMessage } from "../../../../../context/MessageContext";
import { UserStatusType } from "@/type/global";
import { getRankTag, getStatusTag } from "@/utils/utils";

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
  const [deleteUser] = useDeleteUserMutation();

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
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
      width: 200,
      fixed: "left",
      ellipsis: true,
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Số dư",
      dataIndex: "balance",
      key: "balance",
      width: 200,
      align: "right" as const,
      render: (balance: number) => {
        return (
          <div>
            {balance ? `${Number(balance).toLocaleString("vi-VN")} VNĐ` : ""}
          </div>
        );
      },
    },
    {
      title: "Rank",
      dataIndex: "level",
      key: "level",
      width: 100,
      align: "center" as const,
      render: (level: string) => {
        return <>{getRankTag(level)}</>;
      },
    },
    {
      title: "Mã giới thiệu",
      dataIndex: "referral_code",
      key: "referral_code",
      width: 150,
      align: "center" as const,
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
      render: (record: TypeUser) => {
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
                deleteUser({ id: record?.id || 0 }).then((res: any) => {
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
