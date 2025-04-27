/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "antd";
import {
  TransactionStatusType,
  TransactionTypeType,
  UserStatusType,
} from "@/type/global";
import { TypeTransaction } from "@/api/transaction";
import { TypeUser } from "@/api/user";
import moment from "moment";
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
      title: "Người nạp",
      dataIndex: "user",
      key: "user",
      width: 200,
      fixed: "left",
      ellipsis: true,
      render: (record: TypeUser) => {
        return (
          <div>
            {record?.full_name || ""} ({record?.email || ""})
          </div>
        );
      },
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      align: "right" as const,
      render: (amount: number) => {
        return (
          <div>
            {amount ? `${Number(amount).toLocaleString("vi-VN")} VNĐ` : ""}
          </div>
        );
      },
    },
    {
      title: "Loại nạp",
      dataIndex: "type",
      key: "type",
      width: 150,
      align: "center" as const,
      render: (type: TransactionTypeType) => {
        return <div>VnPay</div>;
      },
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
      title: "Ngày nạp",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      align: "center" as const,
      render: (created_at: string) => {
        return <div>{moment(created_at).format("DD-MM-YYYY")}</div>;
      },
    },
  ];
};
