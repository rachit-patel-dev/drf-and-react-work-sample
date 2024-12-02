/* eslint-disable security/detect-object-injection */
import React, { FC, useRef } from "react";

import { useSelector } from "react-redux";

import { RootState } from "../../../Store/store";

import useLanguage from "../../../Hooks/useLanguage";

import Documents from "./Documents";

const Index: FC = () => {
  const authState = useSelector((state: RootState) => state.authReducer);

  const { convertText } = useLanguage();

  const contentRefs = useRef<any>([]);

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>
          {authState?.userDetails?.id ===
          authState?.selectedDirectReporteeUser?.id
            ? convertText("myRadicalFocus")
            : authState?.selectedDirectReporteeUser?.name}
        </h2>
      </div>
      <div className="page-content">
        <div className="tab-content" id="my-scroll-layout">
          <Documents
            ref={(el) => {
              contentRefs.current[4] = el;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Index);
