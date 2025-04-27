import React, { createContext } from "react";
import { Layout, Typography } from "antd";
import { InitialType, useUrlSearchParams } from "use-url-search-params";

import PageContainer from "@/layouts/PageContainer";
import TableData from "./components/TableData";

const { Content } = Layout;

interface UserContextType {
  parameter?: InitialType;
  // eslint-disable-next-line no-unused-vars
  setParameter?: (nextQuery: InitialType) => void;
}

export const UserContext = createContext<UserContextType>({});

const UserGroupPage = () => {
  const [parameter, setParameter] = useUrlSearchParams({ page: 1, limit: 10 });
  const data = { parameter, setParameter };

  return (
    <UserContext.Provider value={data}>
      <PageContainer>
        <Layout style={{ minHeight: "100vh" }}>
          <Content style={{ padding: "16px" }}>
            <Typography.Title level={5} className="uppercase mb-4">
              Quản lý người dùng
            </Typography.Title>

            <Layout>
              <TableData />
            </Layout>
          </Content>
        </Layout>
      </PageContainer>
    </UserContext.Provider>
  );
};

export default UserGroupPage;
