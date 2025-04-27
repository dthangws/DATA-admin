import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { SettingOutlined } from "@ant-design/icons";

import "./index.css";

const { Sider } = Layout;

const HeaderPage = () => {
  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
  };

  const menuItems = [
    {
      key: "user_management",
      label: <Link to="/account-setting/user">Quản lý người dùng</Link>,
    },
    {
      label: "Quản lý danh mục",
      key: "category_system",
      icon: <SettingOutlined />,
      children: [
        {
          label: <Link to="/category-setting/university">Trường học</Link>,
          key: "university",
        },
        {
          label: <Link to="/category-setting/subject">Môn học</Link>,
          key: "subject",
        },
        {
          label: <Link to="/category-setting/category">Chuyên ngành</Link>,
          key: "category",
        },
      ],
    },
    {
      key: "document_management",
      label: <Link to="/document">Quản lý tài liệu</Link>,
    },
    {
      key: "order_management",
      label: <Link to="/order">Quản lý mua tài liệu</Link>,
    },
    {
      key: "transaction_management",
      label: <Link to="/transaction">Quản lý nạp tiền</Link>,
    },
  ];

  return (
    <Sider trigger={null} style={siderStyle}>
      <div className="demo-logo-vertical" />
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={menuItems}
      />
    </Sider>
  );
};

export default HeaderPage;
