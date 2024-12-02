import React, { FC, useEffect, useState } from "react";

import { Layout, Dropdown, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../../Store/store";

import ProfileImage from "../../UI/Image";

import useLogout from "../../../Hooks/useLogout";
import useLanguage from "../../../Hooks/useLanguage";

// css
import "./style.css";

const { Header } = Layout;

const Index: FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const navigate = useNavigate();

  const userDetails = useSelector(
    (state: RootState) => state.authReducer.userDetails
  );

  const { convertText } = useLanguage();

  const { logout } = useLogout();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: convertText("profile"),
    },
    ...(userDetails?.is_ceo
      ? [
          {
            label: convertText("generalSettings"),
            key: "2",
          },
        ]
      : []),
    ...(userDetails?.is_success_manager
      ? [
          {
            label: convertText("switchCompany"),
            key: "3",
          },
        ]
      : []),
    {
      label: convertText("logout"),
      key: "4",
    },
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "1":
        navigate("/profile/settings");
        break;
      case "2":
        navigate("/radical/focus/settings", {
          state: { openGeneralSettings: true },
          replace: true,
        });
        break;
      case "3":
        navigate("/company/list");
        break;
      case "4":
        logout();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setFirstName(userDetails?.first_name);
    setLastName(userDetails?.last_name);
  }, [userDetails]);

  return (
    <Header
      style={{ padding: 0, background: "transparent" }}
      className="custom-header"
    >
      <div className="header-right-content">
        {/* INFO: Will uncomment when below functionality is added in future. */}
        {/* <Link to="/" className="planet-link">
          <img
            src={images.planetlink}
            alt="paper planet"
            className="cust-header-link-img"
          />
        </Link>
        <img
          src={images.notification}
          alt="notification"
          className="cust-header-link-img"
        /> */}

        <Dropdown
          menu={{ items, onClick }}
          trigger={["click"]}
          className="avtar-drop"
        >
          {/*  eslint-disable-next-line */}
          <a onClick={(e) => e.preventDefault()}>
            <div className="user-avtar-initials">
              <ProfileImage 
                firstName={firstName} 
                lastName={lastName} 
                profileImage={userDetails?.profile}
                backgroundColor={userDetails?.profile_color_hash}
                className=""/>
                <Tooltip
                  overlayClassName="task-tooltip"
                  title={`${firstName} ${lastName}`}
                >
                  <span className="avtar-name">
                    {firstName}&nbsp;{lastName}
                  </span>
                </Tooltip>
              <DownOutlined />
            </div>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Index;
