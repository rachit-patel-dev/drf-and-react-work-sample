/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from "react";
import { Button, Spin } from "antd";

// types
import { IButtonProps } from "./Button.types";

// css
import "./style.css";

const Index: FC<IButtonProps> = ({
  buttonLabel,
  className,
  htmlType,
  id,
  isLoading = false,
  ...restProps
}) => {
  return (
    <Button
      htmlType={htmlType}
      className={`${className} ${isLoading ? "loading" : ""}`}
      id={`${id}`}
      disabled={isLoading}
      {...restProps}
    >
      {isLoading ? <Spin /> : buttonLabel}
    </Button>
  );
};

export default Index;
