import React from "react";

import { Layout } from "antd";

import HeaderComponent from "../Components/Core/HeaderComponent";

import { routeHandlers } from "../Library/Utils/routeHandlers";

const { Content } = Layout;

const Common = ({ componentName }: any) => {
  const ComponentToRender = routeHandlers[componentName].component;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <HeaderComponent />
        <Content className="common-content">
          <ComponentToRender />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Common;
