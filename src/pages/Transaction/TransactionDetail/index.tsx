import React from "react";
import { Layout, Typography } from "antd";
import PageContainer from "@/layouts/PageContainer";
import Detail from "./Detail";

const { Content } = Layout;

const TransactionDetail = () => {
  return (
    <PageContainer>
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "16px" }}>
          <Typography.Title level={5} className="uppercase mb-4">
            Chi tiết nạp tiền
          </Typography.Title>

          <Layout>
            <Detail />
          </Layout>
        </Content>
      </Layout>
    </PageContainer>
  );
};

export default TransactionDetail;
