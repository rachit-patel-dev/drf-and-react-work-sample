/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { FC, useEffect, useState } from "react";

interface IProfileImageProps {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  className?: string;
  backgroundColor?: string;
}

const ProfileImage: FC<IProfileImageProps> = ({
  firstName,
  lastName,
  profileImage,
  className,
  backgroundColor,
}) => {
  return (
    <>
      <div>
        {profileImage ? (
          <div className="user-avtar-img-section">
            <img
              src={profileImage}
              alt="avtar"
              className={`user-avtar-img ${className}`}
            />
          </div>
        ) : (
          <div
            className={`user-initials ${className}`}
            style={{
              backgroundColor,
              color: "white",
            }}
          >
            <h2>
              {firstName?.charAt(0).toUpperCase() || ""}
              {lastName?.charAt(0).toUpperCase() || ""}
            </h2>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileImage;

ProfileImage.defaultProps = {
  firstName: "",
  lastName: "",
  profileImage: "",
  className: "list-user-avtar",
  backgroundColor: "",
};
