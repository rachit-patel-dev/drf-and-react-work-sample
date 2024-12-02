/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, ForwardRefRenderFunction, Ref } from "react";

import { Select, SelectProps } from "antd";
import { v4 as uuid } from "uuid";

import { IOptions } from "../../../types/options";

interface ISelectProps extends SelectProps {
  options: IOptions[];
  label?: string;
  className: string;
}

const CustomSelect: ForwardRefRenderFunction<any, ISelectProps> = (
  { options, label, className, ...restProps },
  ref
) => {
  const id = uuid();
  return (
    <div>
      {label && <label htmlFor={id} className=""></label>}
      <Select
        className={className}
        options={options}
        ref={ref}
        {...restProps}
      />
    </div>
  );
};

export default forwardRef(CustomSelect);
