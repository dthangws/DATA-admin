import React, { createContext } from "react";
import { Layout, Typography } from "antd";
import { InitialType, useUrlSearchParams } from "use-url-search-params";

import PageContainer from "@/layouts/PageContainer";
import TableData from "./TableData";

const { Content } = Layout;

interface TransactionContextType {
  parameter?: InitialType;
  // eslint-disable-next-line no-unused-vars
  setParameter?: (nextQuery: InitialType) => void;
}
export const TransactionContext = createContext<TransactionContextType>({});

const TransactionPage = () => {
  const [parameter, setParameter] = useUrlSearchParams({ page: 1, limit: 10 });
  const data = { parameter, setParameter };

  return (
    <TransactionContext.Provider value={data}>
      <PageContainer>
        <Layout style={{ minHeight: "100vh" }}>
          <Content style={{ padding: "16px" }}>
            <Typography.Title level={5} className="uppercase mb-4">
              Quản lý nạp tiền
            </Typography.Title>

            <Layout>
              <TableData />
            </Layout>
          </Content>
        </Layout>
      </PageContainer>
    </TransactionContext.Provider>
  );
};

export default TransactionPage;
