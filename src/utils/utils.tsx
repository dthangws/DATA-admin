import React from "react";
import { Tag } from "antd";

export const getStatusTag = (status: string) => {
  switch (status) {
    case "pending":
      return <Tag color="orange">Pending</Tag>;
    case "active":
      return <Tag color="green">Active</Tag>;
    case "inactive":
      return <Tag color="default">Inactive</Tag>;
    case "blocked":
      return <Tag color="red">Blocked</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
};

export const getRankTag = (level: string) => {
  switch (level) {
    case "Gold":
      return <Tag color="#faad14">Gold</Tag>;

    case "Platinum":
      return <Tag color="#1890ff">Platinum</Tag>;

    case "Diamond":
      return <Tag color="#722ed1">Diamond</Tag>;

    default:
      return <Tag color="#bfbfbf">Silver</Tag>;
  }
};
