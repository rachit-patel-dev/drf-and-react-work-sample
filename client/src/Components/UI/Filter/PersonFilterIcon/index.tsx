/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { FC } from "react";

import { FilterFilled, FilterOutlined } from "@ant-design/icons";
import { FilterValue } from "antd/es/table/interface";

interface IPersonFilterIconProps {
  selectedPersons: string[] | FilterValue;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const GeneralizedFilterIcon: FC<IPersonFilterIconProps> = ({
  selectedPersons,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={`custom-filter-icon ${
        selectedPersons?.length > 0 && !selectedPersons.includes("")
          ? "filter-applied"
          : ""
      }`}
    >
      {selectedPersons?.length > 0 && !selectedPersons.includes("") ? (
        <FilterFilled />
      ) : (
        <FilterOutlined />
      )}
    </span>
  );
};

export default GeneralizedFilterIcon;

GeneralizedFilterIcon.defaultProps = {
  onClick: () => {},
};
