import React from "react";
import { Spin } from "antd";

const loader = () => {
  return (
    <div className="loader">
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </div>
  );
};

export default loader;
