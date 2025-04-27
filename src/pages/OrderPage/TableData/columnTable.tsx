/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "antd";
import { UserStatusType } from "@/type/global";
import { TypeOrder, TypeOrderItem, TypeReferralHistory } from "@/api/order";
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
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 50,
      fixed: "left",
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Người mua",
      dataIndex: "user",
      key: "user",
      width: 300,
      fixed: "left",
      ellipsis: true,
      render: (user: { full_name: string }) => user?.full_name,
    },
    {
      title: "Danh sách tài liệu",
      dataIndex: "orderItems",
      key: "orderItems",
      width: 300,
      ellipsis: true,
      render: (orderItems: TypeOrderItem[]) => {
        return (
          <div>
            {orderItems?.map((item) => (
              <div key={item.id}>
                {item.document?.title} -{" "}
                {item.price
                  ? `${Number(item.price).toLocaleString("vi-VN")} VNĐ`
                  : ""}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 150,
      align: "right" as const,
      render: (total_amount: number) => {
        return (
          <div>
            {total_amount
              ? `${Number(total_amount).toLocaleString("vi-VN")} VNĐ`
              : ""}
          </div>
        );
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "referral_history",
      key: "referral_history",
      width: 150,
      align: "right" as const,
      render: (referral_history: TypeReferralHistory[]) =>
        referral_history?.[0]?.commission_amount
          ? `${Number(referral_history?.[0]?.commission_amount).toLocaleString(
              "vi-VN"
            )} VNĐ`
          : "",
    },
    {
      title: "Ngày mua",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      align: "center" as const,
      render: (createdAt: string) => {
        return <div>{new Date(createdAt).toLocaleDateString("vi-VN")}</div>;
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
  ];
};
